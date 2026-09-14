from datetime import timedelta

from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile
from accounts.views import IsAdminUser
from gamification.models import Achievement, ActivityDay, UserAchievement, XPTransaction
from gamification.serializers import (
    AchievementSerializer,
    ActivityDaySerializer,
    LeaderboardEntrySerializer,
    XPTransactionSerializer,
)
from problems.models import Problem
from submissions.models import Submission


class LeaderboardView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        period = request.query_params.get("period", "global")
        limit = min(int(request.query_params.get("limit", 50)), 100)

        if period == "weekly":
            since = timezone.now() - timedelta(days=7)
            rows = (
                XPTransaction.objects.filter(created_at__gte=since, amount__gt=0)
                .values("user_id", "user__username", "user__profile__level", "user__profile__problems_solved",
                        "user__profile__current_streak", "user__profile__avatar_url")
                .annotate(xp=Sum("amount"))
                .order_by("-xp")[:limit]
            )
            data = []
            for i, row in enumerate(rows, start=1):
                data.append(
                    {
                        "rank": i,
                        "user_id": row["user_id"],
                        "username": row["user__username"],
                        "level": row["user__profile__level"] or 1,
                        "xp": row["xp"] or 0,
                        "problems_solved": row["user__profile__problems_solved"] or 0,
                        "current_streak": row["user__profile__current_streak"] or 0,
                        "avatar_url": row["user__profile__avatar_url"] or "",
                    }
                )
        elif period == "monthly":
            since = timezone.now() - timedelta(days=30)
            rows = (
                XPTransaction.objects.filter(created_at__gte=since, amount__gt=0)
                .values("user_id", "user__username", "user__profile__level", "user__profile__problems_solved",
                        "user__profile__current_streak", "user__profile__avatar_url")
                .annotate(xp=Sum("amount"))
                .order_by("-xp")[:limit]
            )
            data = []
            for i, row in enumerate(rows, start=1):
                data.append(
                    {
                        "rank": i,
                        "user_id": row["user_id"],
                        "username": row["user__username"],
                        "level": row["user__profile__level"] or 1,
                        "xp": row["xp"] or 0,
                        "problems_solved": row["user__profile__problems_solved"] or 0,
                        "current_streak": row["user__profile__current_streak"] or 0,
                        "avatar_url": row["user__profile__avatar_url"] or "",
                    }
                )
        else:
            profiles = Profile.objects.select_related("user").order_by("-xp", "-problems_solved")[:limit]
            data = []
            for i, p in enumerate(profiles, start=1):
                data.append(
                    {
                        "rank": i,
                        "user_id": p.user_id,
                        "username": p.user.username,
                        "level": p.level,
                        "xp": p.xp,
                        "problems_solved": p.problems_solved,
                        "current_streak": p.current_streak,
                        "avatar_url": p.avatar_url or "",
                    }
                )

        return Response(LeaderboardEntrySerializer(data, many=True).data)


class AchievementsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from problems.models import UserProblem

        achievements = Achievement.objects.all()
        unlocked = {
            ua.achievement.code: ua
            for ua in UserAchievement.objects.filter(user=request.user).select_related("achievement")
        }
        profile = request.user.profile
        progress_map = {
            "first_blood": 1 if profile.problems_solved >= 1 else 0,
            "ten_problems": min(profile.problems_solved, 10),
            "algorithm_master": UserProblem.objects.filter(
                user=request.user, solved=True, problem__category__slug="algorithms"
            ).count(),
            "hard_coder": UserProblem.objects.filter(
                user=request.user, solved=True, problem__difficulty="hard"
            ).count(),
            "seven_day_streak": profile.current_streak,
            "century_coder": min(profile.problems_solved, 100),
        }
        ser = AchievementSerializer(
            achievements,
            many=True,
            context={"user_achievements": unlocked, "progress_map": progress_map},
        )
        return Response(ser.data)


class ActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        days = ActivityDay.objects.filter(user=request.user).order_by("date")
        return Response(ActivityDaySerializer(days, many=True).data)


class MyXPView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        txs = XPTransaction.objects.filter(user=request.user)[:50]
        return Response(XPTransactionSerializer(txs, many=True).data)


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.contrib.auth import get_user_model

        User = get_user_model()
        return Response(
            {
                "users": User.objects.count(),
                "problems": Problem.objects.count(),
                "submissions": Submission.objects.filter(is_run_only=False).count(),
                "accepted": Submission.objects.filter(status="accepted", is_run_only=False).count(),
                "by_difficulty": list(
                    Problem.objects.values("difficulty").annotate(count=Count("id")).order_by("difficulty")
                ),
                "by_language": list(
                    Submission.objects.filter(is_run_only=False)
                    .values("language")
                    .annotate(count=Count("id"))
                    .order_by("-count")
                ),
                "recent_submissions": Submission.objects.filter(is_run_only=False).count(),
            }
        )
