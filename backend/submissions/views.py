from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.views import IsAdminUser
from gamification.services import handle_accepted_submission, handle_failed_submission
from problems.models import Problem

from .execution import CodeExecutionService, result_to_dict
from .models import Submission
from .serializers import RunCodeSerializer, SubmissionSerializer, SubmitCodeSerializer


class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["problem", "language", "status"]
    ordering_fields = ["created_at", "runtime"]

    def get_queryset(self):
        qs = Submission.objects.select_related("problem", "user").filter(is_run_only=False)
        if self.request.user.is_admin or self.request.user.is_staff:
            user_id = self.request.query_params.get("user")
            if user_id:
                qs = qs.filter(user_id=user_id)
            elif self.request.query_params.get("all") != "1":
                qs = qs.filter(user=self.request.user)
            return qs
        return qs.filter(user=self.request.user)


class SubmissionDetailView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Submission.objects.select_related("problem", "user")
        if self.request.user.is_admin or self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)


class RunCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        ser = RunCodeSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        try:
            problem = Problem.objects.get(pk=data["problem_id"], is_active=True)
        except Problem.DoesNotExist:
            return Response({"detail": "Problem not found."}, status=404)

        samples = list(
            problem.test_cases.filter(is_sample=True).values("input_data", "expected_output")
        )
        if not samples:
            samples = list(problem.test_cases.all()[:2].values("input_data", "expected_output"))

        service = CodeExecutionService()
        result = service.execute(
            data["code"], data["language"], samples, time_limit_ms=problem.time_limit_ms
        )
        payload = result_to_dict(result)

        Submission.objects.create(
            user=request.user,
            problem=problem,
            language=data["language"],
            code=data["code"],
            status=result.status,
            runtime=result.runtime_ms,
            memory=result.memory_mb,
            stdout=result.stdout,
            stderr=result.stderr,
            test_results=payload["test_results"],
            passed_tests=result.passed_tests,
            total_tests=result.total_tests,
            is_run_only=True,
        )
        return Response(payload)


class SubmitCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        ser = SubmitCodeSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        try:
            problem = Problem.objects.select_related("category").get(pk=data["problem_id"], is_active=True)
        except Problem.DoesNotExist:
            return Response({"detail": "Problem not found."}, status=404)

        cases = list(problem.test_cases.all().values("input_data", "expected_output"))
        if not cases:
            return Response({"detail": "Problem has no test cases."}, status=400)

        service = CodeExecutionService()
        result = service.execute(
            data["code"], data["language"], cases, time_limit_ms=problem.time_limit_ms
        )
        payload = result_to_dict(result)

        submission = Submission.objects.create(
            user=request.user,
            problem=problem,
            language=data["language"],
            code=data["code"],
            status=result.status,
            runtime=result.runtime_ms,
            memory=result.memory_mb,
            stdout=result.stdout,
            stderr=result.stderr,
            test_results=payload["test_results"],
            passed_tests=result.passed_tests,
            total_tests=result.total_tests,
            is_run_only=False,
        )

        problem.total_submissions += 1
        reward = None
        if result.status == "accepted":
            problem.accepted_submissions += 1
            reward = handle_accepted_submission(request.user, problem, runtime=result.runtime_ms)
        else:
            handle_failed_submission(request.user)
        problem.save(update_fields=["total_submissions", "accepted_submissions", "updated_at"])

        return Response(
            {
                "submission": SubmissionSerializer(submission).data,
                "result": payload,
                "reward": reward,
            },
            status=status.HTTP_201_CREATED,
        )


class AdminSubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAdminUser]
    queryset = Submission.objects.select_related("problem", "user").filter(is_run_only=False)
    filterset_fields = ["problem", "language", "status", "user"]
