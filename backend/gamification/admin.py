from django.contrib import admin

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


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "threshold")


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ("user", "achievement", "unlocked_at")


@admin.register(XPTransaction)
class XPTransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "reason", "created_at")


@admin.register(CoinTransaction)
class CoinTransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "transaction_type", "description", "created_at")
    list_filter = ("transaction_type",)
    search_fields = ("user__username", "description")


@admin.register(ShopItem)
class ShopItemAdmin(admin.ModelAdmin):
    list_display = ("item_id", "title", "category", "price", "rarity", "is_active")
    list_filter = ("category", "rarity", "is_active")
    search_fields = ("item_id", "title")


@admin.register(UserPurchase)
class UserPurchaseAdmin(admin.ModelAdmin):
    list_display = ("user", "item", "is_equipped", "purchased_at")
    list_filter = ("is_equipped", "item__category")
    search_fields = ("user__username", "item__title")


@admin.register(CodingStreak)
class CodingStreakAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "problems_solved", "xp_earned")


@admin.register(ActivityDay)
class ActivityDayAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "count")
