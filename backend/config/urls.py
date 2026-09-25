from django.http import HttpResponse, JsonResponse
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

def home_view(request):
    if "application/json" in request.META.get("HTTP_ACCEPT", ""):
        return JsonResponse({
            "status": "online",
            "name": "CodeArena API",
            "version": "2.0.0",
            "description": "CodeArena Competitive Programming Backend API",
            "problems_count": 30,
            "endpoints": {
                "problems": "/api/problems/",
                "leaderboard": "/api/leaderboard/",
                "dashboard": "/api/dashboard/",
                "admin": "/admin/",
            },
        })
    html = """<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeArena API — Live</title>
    <style>
        body { margin: 0; background: #050811; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
        .card { background: #0c101b; border: 1px solid #27272a; border-radius: 20px; padding: 40px; max-width: 520px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); text-align: center; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; }
        h1 { margin: 0 0 12px 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
        h1 span { color: #10b981; }
        p { margin: 0 0 28px 0; color: #a1a1aa; font-size: 15px; line-height: 1.6; }
        .btn-group { display: flex; flex-direction: column; gap: 10px; }
        .btn { display: block; padding: 13px 20px; border-radius: 12px; font-weight: 600; text-decoration: none; font-size: 14px; transition: all 0.2s; }
        .btn-primary { background: linear-gradient(180deg, #34d399, #10b981); color: #09090b; box-shadow: 0 4px 15px rgba(16,185,129,0.35); }
        .btn-secondary { background: #18181b; border: 1px solid #27272a; color: #e4e4e7; }
        .btn:hover { opacity: 0.95; transform: translateY(-1px); }
        .stats { display: flex; justify-content: space-around; margin-top: 28px; padding-top: 24px; border-top: 1px solid #27272a; }
        .stat-val { font-size: 22px; font-weight: 800; color: #ffffff; font-family: monospace; }
        .stat-lbl { font-size: 12px; color: #71717a; margin-top: 4px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge"><span class="dot"></span> Backend API Jonli Ishlamoqda</div>
        <h1>Code<span>Arena</span> API</h1>
        <p>Django REST Framework backend serveri Render bulutida muvaffaqiyatli ishga tushirildi. 30 ta masala va barcha endpointlar faol.</p>
        <div class="btn-group">
            <a href="/api/problems/" class="btn btn-primary">📚 30 ta Masalalar API (/api/problems/)</a>
            <a href="/admin/" class="btn btn-secondary">🔐 Django Admin Panel (/admin/)</a>
            <a href="/api/leaderboard/" class="btn btn-secondary">🏆 Yetakchilar Reytingi (/api/leaderboard/)</a>
        </div>
        <div class="stats">
            <div><div class="stat-val">30</div><div class="stat-lbl">Masalalar</div></div>
            <div><div class="stat-val" style="color:#10b981;">200 OK</div><div class="stat-lbl">Holat</div></div>
            <div><div class="stat-val" style="color:#38bdf8;">&lt; 30ms</div><div class="stat-lbl">Tezlik</div></div>
        </div>
    </div>
</body>
</html>"""
    return HttpResponse(html)

from gamification.shop_views import (
    ReferralInfoView,
    ShopBuyView,
    ShopEquipView,
    ShopItemListView,
    UserInventoryView,
)

urlpatterns = [
    path("", home_view, name="home"),
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
    path("api/shop/items/", ShopItemListView.as_view(), name="shop-items"),
    path("api/shop/buy/", ShopBuyView.as_view(), name="shop-buy"),
    path("api/shop/equip/", ShopEquipView.as_view(), name="shop-equip"),
    path("api/shop/inventory/", UserInventoryView.as_view(), name="shop-inventory"),
    path("api/referrals/", ReferralInfoView.as_view(), name="referrals"),
    path("api/admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("api/admin/submissions/", AdminSubmissionListView.as_view(), name="admin-submissions"),
    path("api/", include(router.urls)),
]
