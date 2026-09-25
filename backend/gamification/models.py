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


class CoinTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="coin_transactions")
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=40)  # problem_solve, referral_bonus, shop_purchase, etc.
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Coin<{self.user_id}:{self.amount}>"


class ShopItem(models.Model):
    CATEGORY_CHOICES = (
        ("frame", "Avatar Frame"),
        ("title", "Profile Title"),
        ("theme", "IDE Theme"),
        ("booster", "Booster & Utility"),
    )
    RARITY_CHOICES = (
        ("common", "Common"),
        ("rare", "Rare"),
        ("epic", "Epic"),
        ("legendary", "Legendary"),
    )

    item_id = models.CharField(max_length=60, unique=True)
    title = models.CharField(max_length=120)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    price = models.PositiveIntegerField(default=100)
    icon = models.CharField(max_length=50, default="sparkles")
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default="rare")
    preview_data = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["price"]

    def __str__(self):
        return f"{self.title} ({self.price} coins)"


class UserPurchase(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="purchases")
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE, related_name="owners")
    is_equipped = models.BooleanField(default=False)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "item")
        ordering = ["-purchased_at"]

    def __str__(self):
        return f"{self.user_id} owns {self.item.item_id}"

