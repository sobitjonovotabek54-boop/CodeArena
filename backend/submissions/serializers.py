from rest_framework import serializers

from problems.serializers import ProblemListSerializer

from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source="problem.title", read_only=True)
    problem_slug = serializers.CharField(source="problem.slug", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Submission
        fields = (
            "id",
            "user",
            "username",
            "problem",
            "problem_title",
            "problem_slug",
            "language",
            "code",
            "status",
            "runtime",
            "memory",
            "stdout",
            "stderr",
            "test_results",
            "passed_tests",
            "total_tests",
            "is_run_only",
            "created_at",
        )
        read_only_fields = (
            "user",
            "status",
            "runtime",
            "memory",
            "stdout",
            "stderr",
            "test_results",
            "passed_tests",
            "total_tests",
            "created_at",
        )


class RunCodeSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    language = serializers.ChoiceField(choices=Submission.Language.choices)
    code = serializers.CharField()


class SubmitCodeSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField()
    language = serializers.ChoiceField(choices=Submission.Language.choices)
    code = serializers.CharField()
