from django.conf import settings
from django.db import models

from problems.models import Problem


class Submission(models.Model):
    class Language(models.TextChoices):
        PYTHON = "python", "Python"
        JAVASCRIPT = "javascript", "JavaScript"
        CPP = "cpp", "C++"
        JAVA = "java", "Java"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        ACCEPTED = "accepted", "Accepted"
        WRONG_ANSWER = "wrong_answer", "Wrong Answer"
        RUNTIME_ERROR = "runtime_error", "Runtime Error"
        TIME_LIMIT_EXCEEDED = "time_limit_exceeded", "Time Limit Exceeded"
        COMPILATION_ERROR = "compilation_error", "Compilation Error"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submissions")
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="submissions")
    language = models.CharField(max_length=20, choices=Language.choices)
    code = models.TextField()
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.PENDING)
    runtime = models.FloatField(null=True, blank=True, help_text="Runtime in ms")
    memory = models.FloatField(null=True, blank=True, help_text="Memory in MB")
    stdout = models.TextField(blank=True, default="")
    stderr = models.TextField(blank=True, default="")
    test_results = models.JSONField(default=list, blank=True)
    passed_tests = models.PositiveIntegerField(default=0)
    total_tests = models.PositiveIntegerField(default=0)
    is_run_only = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Submission<{self.id}:{self.status}>"
