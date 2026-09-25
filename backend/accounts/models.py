from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, default="")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    avatar_url = models.URLField(blank=True, default="")
    xp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    coins = models.PositiveIntegerField(default=100)
    referral_code = models.CharField(max_length=20, unique=True, blank=True, null=True)
    referred_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="referrals")
    equipped_frame = models.CharField(max_length=50, blank=True, default="")
    equipped_title = models.CharField(max_length=100, blank=True, default="")
    equipped_theme = models.CharField(max_length=50, blank=True, default="vs-dark")
    streak_shields = models.PositiveIntegerField(default=0)
    problems_solved = models.PositiveIntegerField(default=0)
    total_submissions = models.PositiveIntegerField(default=0)
    accepted_submissions = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_solved_date = models.DateField(null=True, blank=True)
    preferred_language = models.CharField(max_length=32, default="python")
    github_username = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-xp"]

    def save(self, *args, **kwargs):
        if not self.referral_code:
            import secrets
            token = secrets.token_hex(3).upper()
            username_prefix = "".join(c for c in self.user.username if c.isalnum())[:6].upper()
            self.referral_code = f"CA_{username_prefix}_{token}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Profile<{self.user.username}>"

    @property
    def acceptance_rate(self):
        if self.total_submissions == 0:
            return 0.0
        return round((self.accepted_submissions / self.total_submissions) * 100, 1)

    @property
    def xp_for_current_level(self):
        return self.xp_needed_for_level(self.level)

    @property
    def xp_for_next_level(self):
        return self.xp_needed_for_level(self.level + 1)

    @property
    def xp_progress(self):
        current = self.xp_for_current_level
        nxt = self.xp_for_next_level
        if nxt <= current:
            return 100.0
        return round(((self.xp - current) / (nxt - current)) * 100, 1)

    @staticmethod
    def xp_needed_for_level(level: int) -> int:
        # Level 1 starts at 0 XP; each level needs +100 more than previous
        if level <= 1:
            return 0
        return ((level - 1) * level // 2) * 100

    def recalculate_level(self):
        level = 1
        while self.xp >= self.xp_needed_for_level(level + 1):
            level += 1
        self.level = level
