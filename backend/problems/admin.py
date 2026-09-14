from django.contrib import admin

from .models import Category, Problem, TestCase, UserProblem


class TestCaseInline(admin.TabularInline):
    model = TestCase
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ("name", "slug")


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ("title", "difficulty", "category", "xp_reward", "is_active", "is_daily_challenge")
    list_filter = ("difficulty", "category", "is_active")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title",)
    inlines = [TestCaseInline]


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ("problem", "is_sample", "is_hidden", "order")
    list_filter = ("is_sample", "is_hidden")


@admin.register(UserProblem)
class UserProblemAdmin(admin.ModelAdmin):
    list_display = ("user", "problem", "solved", "attempts")
