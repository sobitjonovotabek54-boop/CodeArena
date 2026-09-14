from rest_framework import serializers

from .models import Achievement, ActivityDay, CodingStreak, UserAchievement, XPTransaction


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
    problems_solved = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    avatar_url = serializers.CharField(allow_blank=True)
