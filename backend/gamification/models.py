from django.conf import settings
from django.db import models


class Achievement(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default="trophy")
    threshold = models.PositiveIntegerField(default=1)
    category = models.CharField(max_length=50, default="general")

    def __str__(self):
        return self.title


class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="unlocks")
    unlocked_at = models.DateTimeField(auto_now_add=True)
    progress = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "achievement")

    def __str__(self):
        return f"{self.user_id}:{self.achievement.code}"


class XPTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="xp_transactions")
    amount = models.IntegerField()
    reason = models.CharField(max_length=200)
    problem = models.ForeignKey(
        "problems.Problem", on_delete=models.SET_NULL, null=True, blank=True, related_name="xp_transactions"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"XP<{self.user_id}:{self.amount}>"


class CodingStreak(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="streak_days")
    date = models.DateField()
    problems_solved = models.PositiveIntegerField(default=0)
    xp_earned = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"Streak<{self.user_id}:{self.date}>"


class ActivityDay(models.Model):
    """GitHub-style contribution chart data."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activity_days")
    date = models.DateField()
    count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "date")
        ordering = ["date"]
