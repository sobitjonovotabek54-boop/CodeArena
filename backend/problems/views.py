from django_filters import rest_framework as filters
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.views import IsAdminUser

from .models import Category, Problem, TestCase, UserProblem
from .serializers import (
    CategorySerializer,
    ProblemAdminSerializer,
    ProblemDetailSerializer,
    ProblemListSerializer,
    TestCaseSerializer,
)


class ProblemFilter(filters.FilterSet):
    difficulty = filters.CharFilter(field_name="difficulty")
    category = filters.CharFilter(field_name="category__slug")
    solved = filters.BooleanFilter(method="filter_solved")

    class Meta:
        model = Problem
        fields = ["difficulty", "category", "solved"]

    def filter_solved(self, queryset, name, value):
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none() if value else queryset
        solved_ids = UserProblem.objects.filter(user=user, solved=True).values_list("problem_id", flat=True)
        if value:
            return queryset.filter(id__in=solved_ids)
        return queryset.exclude(id__in=solved_ids)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"
    search_fields = ["name"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdminUser()]


from rest_framework.pagination import PageNumberPagination

class ProblemPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = "page_size"
    max_page_size = 100


class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.select_related("category").filter(is_active=True)
    pagination_class = ProblemPagination
    filterset_class = ProblemFilter
    search_fields = ["title", "description"]
    ordering_fields = ["id", "difficulty", "xp_reward", "created_at", "accepted_submissions"]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ProblemListSerializer
        if self.request and self.request.user.is_authenticated and (
            self.request.user.is_admin or self.request.user.is_staff
        ):
            if self.action in ("create", "update", "partial_update", "retrieve"):
                return ProblemAdminSerializer if self.action == "retrieve" else ProblemDetailSerializer
        if self.action == "retrieve":
            return ProblemDetailSerializer
        return ProblemDetailSerializer

    def get_queryset(self):
        qs = Problem.objects.select_related("category").prefetch_related("test_cases")
        user = self.request.user
        if user.is_authenticated and (user.is_admin or user.is_staff):
            return qs
        return qs.filter(is_active=True)

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def starter(self, request, slug=None):
        problem = self.get_object()
        return Response(problem.starter_code)


class TestCaseViewSet(viewsets.ModelViewSet):
    queryset = TestCase.objects.select_related("problem").all()
    serializer_class = TestCaseSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ["problem", "is_sample", "is_hidden"]
