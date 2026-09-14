from django.contrib import admin

from .models import Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "problem", "language", "status", "runtime", "is_run_only", "created_at")
    list_filter = ("status", "language", "is_run_only")
    search_fields = ("user__username", "problem__title")
