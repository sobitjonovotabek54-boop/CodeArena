from rest_framework import serializers

from .models import (
    Achievement,
    ActivityDay,
    CodingStreak,
    CoinTransaction,
    ShopItem,
    UserAchievement,
    UserPurchase,
    XPTransaction,
)


class AchievementSerializer(serializers.ModelSerializer):
    unlocked = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    unlocked_at = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = (
            "id",
            "code",
            "title",
            "description",
            "icon",
            "threshold",
            "category",
            "unlocked",
            "progress",
            "unlocked_at",
        )

    def get_unlocked(self, obj):
        mapping = self.context.get("user_achievements", {})
        return obj.code in mapping

    def get_progress(self, obj):
        mapping = self.context.get("user_achievements", {})
        if obj.code in mapping:
            return obj.threshold
        return self.context.get("progress_map", {}).get(obj.code, 0)

    def get_unlocked_at(self, obj):
        mapping = self.context.get("user_achievements", {})
        ua = mapping.get(obj.code)
        return ua.unlocked_at if ua else None


class XPTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = XPTransaction
        fields = ("id", "amount", "reason", "problem", "created_at")


class CodingStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingStreak
        fields = ("date", "problems_solved", "xp_earned")


class ActivityDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityDay
        fields = ("date", "count")


class LeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    level = serializers.IntegerField()
    xp = serializers.IntegerField()
    coins = serializers.IntegerField(default=0)
    equipped_frame = serializers.CharField(default="", allow_blank=True)
    equipped_title = serializers.CharField(default="", allow_blank=True)
    problems_solved = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    avatar_url = serializers.CharField(allow_blank=True)


class CoinTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinTransaction
        fields = ("id", "amount", "transaction_type", "description", "created_at")


class ShopItemSerializer(serializers.ModelSerializer):
    is_owned = serializers.SerializerMethodField()
    is_equipped = serializers.SerializerMethodField()

    class Meta:
        model = ShopItem
        fields = (
            "id",
            "item_id",
            "title",
            "description",
            "category",
            "price",
            "icon",
            "rarity",
            "preview_data",
            "is_owned",
            "is_equipped",
        )

    def get_is_owned(self, obj):
        user_purchases = self.context.get("user_purchases", set())
        return obj.id in user_purchases or obj.item_id in user_purchases

    def get_is_equipped(self, obj):
        equipped_items = self.context.get("equipped_items", set())
        return obj.item_id in equipped_items


class UserPurchaseSerializer(serializers.ModelSerializer):
    item = ShopItemSerializer(read_only=True)

    class Meta:
        model = UserPurchase
        fields = ("id", "item", "is_equipped", "purchased_at")

