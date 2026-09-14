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

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "password_confirm", "first_name", "last_name")

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Parollar bir-biriga mos kelmadi."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        with transaction.atomic():
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            Profile.objects.get_or_create(user=user)
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
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "xp",
            "level",
            "problems_solved",
            "total_submissions",
            "accepted_submissions",
            "current_streak",
            "longest_streak",
            "last_solved_date",
        )

    def get_rank(self, obj):
        return Profile.objects.filter(xp__gt=obj.xp).count() + 1


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "is_admin", "date_joined", "profile")
