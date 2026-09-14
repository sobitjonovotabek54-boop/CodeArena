from rest_framework import serializers

from .models import Category, Problem, TestCase, UserProblem


class CategorySerializer(serializers.ModelSerializer):
    problem_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "icon", "problem_count")

    def get_problem_count(self, obj):
        return obj.problems.count()


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ("id", "input_data", "expected_output", "is_sample", "is_hidden", "order", "explanation")


class SampleTestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ("id", "input_data", "expected_output", "order", "explanation")


class ProblemListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    acceptance_rate = serializers.FloatField(read_only=True)
    solved = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = (
            "id",
            "title",
            "slug",
            "difficulty",
            "category",
            "xp_reward",
            "acceptance_rate",
            "total_submissions",
            "accepted_submissions",
            "is_daily_challenge",
            "solved",
            "created_at",
        )

    def get_solved(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return UserProblem.objects.filter(user=request.user, problem=obj, solved=True).exists()


class ProblemDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True, required=False
    )
    acceptance_rate = serializers.FloatField(read_only=True)
    sample_tests = serializers.SerializerMethodField()
    solved = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "difficulty",
            "category",
            "category_id",
            "xp_reward",
            "constraints",
            "input_format",
            "output_format",
            "examples",
            "starter_code",
            "time_limit_ms",
            "memory_limit_mb",
            "acceptance_rate",
            "total_submissions",
            "accepted_submissions",
            "is_active",
            "is_daily_challenge",
            "sample_tests",
            "solved",
            "created_at",
            "updated_at",
        )

    def get_sample_tests(self, obj):
        samples = obj.test_cases.filter(is_sample=True)
        return SampleTestCaseSerializer(samples, many=True).data

    def get_solved(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return UserProblem.objects.filter(user=request.user, problem=obj, solved=True).exists()


class ProblemAdminSerializer(ProblemDetailSerializer):
    test_cases = TestCaseSerializer(many=True, read_only=True)

    class Meta(ProblemDetailSerializer.Meta):
        fields = ProblemDetailSerializer.Meta.fields + ("test_cases",)
