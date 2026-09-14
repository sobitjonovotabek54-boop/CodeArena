from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Profile
from .serializers import ProfileSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_admin or request.user.is_staff))


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileMeView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class ProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "user__username"
    lookup_url_kwarg = "username"

    def get_queryset(self):
        return Profile.objects.select_related("user")


class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related("profile").all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    search_fields = ["username", "email"]

    @action(detail=True, methods=["post"])
    def toggle_admin(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response({"detail": "Cannot change your own admin status."}, status=400)
        user.is_admin = not user.is_admin
        user.is_staff = user.is_admin
        user.save(update_fields=["is_admin", "is_staff"])
        return Response(UserSerializer(user).data)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_view(request):
    from datetime import timedelta

    from django.utils import timezone

    from gamification.models import ActivityDay, XPTransaction
    from problems.models import Problem, UserProblem
    from submissions.models import Submission

    profile, _ = Profile.objects.get_or_create(user=request.user)
    rank = Profile.objects.filter(xp__gt=profile.xp).count() + 1
    recent = Submission.objects.filter(user=request.user, is_run_only=False)[:8]
    today_challenge = Problem.objects.filter(is_daily_challenge=True, is_active=True).first()
    if not today_challenge:
        today_challenge = Problem.objects.filter(is_active=True).order_by("?").first()

    week_ago = timezone.now().date() - timedelta(days=365)
    activity = ActivityDay.objects.filter(user=request.user, date__gte=week_ago).order_by("date")
    xp_recent = XPTransaction.objects.filter(user=request.user)[:10]
    solved_ids = set(
        UserProblem.objects.filter(user=request.user, solved=True).values_list("problem_id", flat=True)
    )

    featured_problems = Problem.objects.filter(is_active=True).select_related("category").order_by("id")[:6]
    total_problems = Problem.objects.filter(is_active=True).count()

    from problems.serializers import ProblemListSerializer
    from submissions.serializers import SubmissionSerializer
    from gamification.serializers import ActivityDaySerializer, XPTransactionSerializer

    return Response(
        {
            "profile": ProfileSerializer(profile, context={"request": request}).data,
            "rank": rank,
            "today_challenge": ProblemListSerializer(today_challenge, context={"request": request}).data
            if today_challenge
            else None,
            "featured_problems": ProblemListSerializer(featured_problems, many=True, context={"request": request}).data,
            "total_problems": total_problems,
            "recent_submissions": SubmissionSerializer(recent, many=True).data,
            "recent_xp": XPTransactionSerializer(xp_recent, many=True).data,
            "activity": ActivityDaySerializer(activity, many=True).data,
            "solved_count": len(solved_ids),
        }
    )
