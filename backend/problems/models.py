from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, default="")
    icon = models.CharField(max_length=50, blank=True, default="code")

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Problem(models.Model):
    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    XP_MAP = {
        Difficulty.EASY: 10,
        Difficulty.MEDIUM: 25,
        Difficulty.HARD: 50,
    }

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.EASY)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="problems")
    xp_reward = models.PositiveIntegerField(default=10)
    constraints = models.TextField(blank=True, default="")
    input_format = models.TextField(blank=True, default="")
    output_format = models.TextField(blank=True, default="")
    examples = models.JSONField(default=list, blank=True)
    starter_code = models.JSONField(default=dict, blank=True)
    time_limit_ms = models.PositiveIntegerField(default=2000)
    memory_limit_mb = models.PositiveIntegerField(default=256)
    total_submissions = models.PositiveIntegerField(default=0)
    accepted_submissions = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_daily_challenge = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            i = 1
            while Problem.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{i}"
                i += 1
            self.slug = slug
        if not self.xp_reward:
            self.xp_reward = self.XP_MAP.get(self.difficulty, 10)
        super().save(*args, **kwargs)

    @property
    def acceptance_rate(self):
        if self.total_submissions == 0:
            return 0.0
        return round((self.accepted_submissions / self.total_submissions) * 100, 1)

    def __str__(self):
        return self.title


class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="test_cases")
    input_data = models.TextField()
    expected_output = models.TextField()
    is_sample = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    explanation = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"TestCase<{self.problem_id}:{self.id}>"


class UserProblem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="solved_problems")
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="solvers")
    solved = models.BooleanField(default=False)
    first_solved_at = models.DateTimeField(null=True, blank=True)
    best_runtime = models.FloatField(null=True, blank=True)
    attempts = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "problem")

    def __str__(self):
        return f"{self.user_id}-{self.problem_id}"
