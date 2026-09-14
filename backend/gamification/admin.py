from django.contrib import admin

from .models import Achievement, ActivityDay, CodingStreak, UserAchievement, XPTransaction


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "threshold")


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ("user", "achievement", "unlocked_at")


@admin.register(XPTransaction)
class XPTransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "reason", "created_at")


@admin.register(CodingStreak)
class CodingStreakAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "problems_solved", "xp_earned")


@admin.register(ActivityDay)
class ActivityDayAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "count")
