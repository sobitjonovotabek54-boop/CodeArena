from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import (
    MeView,
    ProfileDetailView,
    ProfileMeView,
    RegisterView,
    UserAdminViewSet,
    dashboard_view,
)
from gamification.views import AchievementsView, ActivityView, AdminStatsView, LeaderboardView, MyXPView
from problems.views import CategoryViewSet, ProblemViewSet, TestCaseViewSet
from submissions.views import (
    AdminSubmissionListView,
    RunCodeView,
    SubmissionDetailView,
    SubmissionListView,
    SubmitCodeView,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"problems", ProblemViewSet, basename="problem")
router.register(r"testcases", TestCaseViewSet, basename="testcase")
router.register(r"admin/users", UserAdminViewSet, basename="admin-users")

urlpatterns = [
    path("admin/", __import__("django.contrib.admin", fromlist=["site"]).site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/profile/me/", ProfileMeView.as_view(), name="profile-me"),
    path("api/profile/<str:username>/", ProfileDetailView.as_view(), name="profile-detail"),
    path("api/dashboard/", dashboard_view, name="dashboard"),
    path("api/submissions/", SubmissionListView.as_view(), name="submissions"),
    path("api/submissions/<int:pk>/", SubmissionDetailView.as_view(), name="submission-detail"),
    path("api/run/", RunCodeView.as_view(), name="run-code"),
    path("api/submit/", SubmitCodeView.as_view(), name="submit-code"),
    path("api/leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
    path("api/achievements/", AchievementsView.as_view(), name="achievements"),
    path("api/activity/", ActivityView.as_view(), name="activity"),
    path("api/xp/", MyXPView.as_view(), name="xp"),
    path("api/admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("api/admin/submissions/", AdminSubmissionListView.as_view(), name="admin-submissions"),
    path("api/", include(router.urls)),
]
