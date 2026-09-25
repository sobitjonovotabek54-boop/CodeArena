from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Profile, User


class ProfileInline(admin.StackedInline):
    model = Profile
    fk_name = "user"
    can_delete = False


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "is_admin", "is_staff", "is_active")
    list_filter = ("is_admin", "is_staff", "is_active")
    fieldsets = BaseUserAdmin.fieldsets + (("CodeArena", {"fields": ("is_admin",)}),)
    inlines = [ProfileInline]


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "coins", "xp", "level", "referral_code", "problems_solved", "current_streak")
    search_fields = ("user__username", "referral_code")
