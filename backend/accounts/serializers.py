from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Profile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Bu email allaqachon ro'yxatdan o'tgan yoki noto'g'ri.",
            )
        ],
        error_messages={
            "invalid": "Email manzili noto'g'ri kiritildi.",
            "required": "Email kiritilishi shart.",
        }
    )
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Bu username allaqachon mavjud.",
            )
        ],
        error_messages={
            "required": "Username kiritilishi shart.",
        }
    )
    password = serializers.CharField(write_only=True, min_length=6, error_messages={
        "min_length": "Parol kamida 6 ta belgidan iborat bo'lishi kerak.",
    })
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    ref_code = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "password_confirm", "first_name", "last_name", "ref_code")

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Parollar bir-biriga mos kelmadi."})
        return attrs

    def create(self, validated_data):
        from gamification.services import award_coins

        validated_data.pop("password_confirm")
        ref_code = validated_data.pop("ref_code", None)
        password = validated_data.pop("password")
        with transaction.atomic():
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            profile, _ = Profile.objects.get_or_create(user=user)

            if ref_code:
                try:
                    inviter_profile = Profile.objects.select_related("user").get(referral_code=ref_code.strip())
                    if inviter_profile.user != user:
                        profile.referred_by = inviter_profile.user
                        profile.save(update_fields=["referred_by", "updated_at"])

                        # Yangi ro'yxatdan o'tganga 100 coin xush kelibsiz bonusi
                        award_coins(
                            user,
                            100,
                            f"Taklif orqali qo'shilish bonusi! +100 Coin",
                            transaction_type="welcome_bonus",
                        )

                        # Taklif qilgan o'rtog'iga 500 coin berish
                        award_coins(
                            inviter_profile.user,
                            500,
                            f"Do'stingiz {user.username} taklifingiz bilan qo'shildi! +500 Coin",
                            transaction_type="referral_bonus",
                        )
                except Profile.DoesNotExist:
                    pass

        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    is_admin = serializers.BooleanField(source="user.is_admin", read_only=True)
    acceptance_rate = serializers.FloatField(read_only=True)
    xp_progress = serializers.FloatField(read_only=True)
    xp_for_next_level = serializers.IntegerField(read_only=True)
    xp_for_current_level = serializers.IntegerField(read_only=True)
    rank = serializers.SerializerMethodField()
    referral_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "email",
            "is_admin",
            "bio",
            "avatar",
            "avatar_url",
            "xp",
            "level",
            "coins",
            "referral_code",
            "equipped_frame",
            "equipped_title",
            "equipped_theme",
            "streak_shields",
            "problems_solved",
            "total_submissions",
            "accepted_submissions",
            "acceptance_rate",
            "current_streak",
            "longest_streak",
            "last_solved_date",
            "preferred_language",
            "github_username",
            "xp_progress",
            "xp_for_current_level",
            "xp_for_next_level",
            "rank",
            "referral_count",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "xp",
            "level",
            "coins",
            "referral_code",
            "problems_solved",
            "total_submissions",
            "accepted_submissions",
            "current_streak",
            "longest_streak",
            "last_solved_date",
        )

    def get_rank(self, obj):
        return Profile.objects.filter(xp__gt=obj.xp).count() + 1

    def get_referral_count(self, obj):
        return Profile.objects.filter(referred_by=obj.user).count()


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "is_admin", "date_joined", "profile")

