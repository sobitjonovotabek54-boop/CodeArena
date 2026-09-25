from datetime import date, timedelta

from django.db import transaction
from django.utils import timezone

from accounts.models import Profile
from gamification.models import (
    Achievement,
    ActivityDay,
    CodingStreak,
    CoinTransaction,
    UserAchievement,
    XPTransaction,
)
from problems.models import UserProblem

COIN_REWARDS = {
    "easy": 50,
    "medium": 150,
    "hard": 300,
}


def award_coins(user, amount: int, reason: str, transaction_type: str = "general"):
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.coins += amount
    profile.save(update_fields=["coins", "updated_at"])
    CoinTransaction.objects.create(
        user=user, amount=amount, transaction_type=transaction_type, description=reason
    )
    return profile


def deduct_coins(user, amount: int, reason: str, transaction_type: str = "shop_purchase"):
    profile, _ = Profile.objects.get_or_create(user=user)
    if profile.coins < amount:
        raise ValueError("Yetarli coin mavjud emas.")
    profile.coins -= amount
    profile.save(update_fields=["coins", "updated_at"])
    CoinTransaction.objects.create(
        user=user, amount=-amount, transaction_type=transaction_type, description=reason
    )
    return profile


def award_xp(user, amount: int, reason: str, problem=None):
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.xp += amount
    profile.recalculate_level()
    profile.save(update_fields=["xp", "level", "updated_at"])
    XPTransaction.objects.create(user=user, amount=amount, reason=reason, problem=problem)
    return profile


def update_streak(user, xp_earned: int = 0):
    today = timezone.now().date()
    profile, _ = Profile.objects.get_or_create(user=user)
    streak_day, created = CodingStreak.objects.get_or_create(
        user=user, date=today, defaults={"problems_solved": 1, "xp_earned": xp_earned}
    )
    if not created:
        streak_day.problems_solved += 1
        streak_day.xp_earned += xp_earned
        streak_day.save()

    if profile.last_solved_date == today:
        pass
    elif profile.last_solved_date == today - timedelta(days=1):
        profile.current_streak += 1
    elif profile.last_solved_date and profile.current_streak > 0:
        # Streak qalqoni: har bir o'tkazib yuborilgan kun uchun bitta qalqon sarflanadi
        missed_days = (today - profile.last_solved_date).days - 1
        if 0 < missed_days <= profile.streak_shields:
            profile.streak_shields -= missed_days
            profile.current_streak += 1
        else:
            profile.current_streak = 1
    else:
        profile.current_streak = 1

    profile.longest_streak = max(profile.longest_streak, profile.current_streak)
    profile.last_solved_date = today
    profile.save(
        update_fields=["current_streak", "longest_streak", "last_solved_date", "streak_shields", "updated_at"]
    )
    return profile


def bump_activity(user):
    today = timezone.now().date()
    day, created = ActivityDay.objects.get_or_create(user=user, date=today, defaults={"count": 1})
    if not created:
        day.count += 1
        day.save(update_fields=["count"])


def check_achievements(user):
    profile = user.profile
    progress = {
        "first_blood": 1 if profile.problems_solved >= 1 else 0,
        "ten_problems": min(profile.problems_solved, 10),
        "algorithm_master": UserProblem.objects.filter(
            user=user, solved=True, problem__category__slug="algorithms"
        ).count(),
        "hard_coder": UserProblem.objects.filter(
            user=user, solved=True, problem__difficulty="hard"
        ).count(),
        "seven_day_streak": profile.current_streak,
        "century_coder": min(profile.problems_solved, 100),
    }
    thresholds = {
        "first_blood": 1,
        "ten_problems": 10,
        "algorithm_master": 5,
        "hard_coder": 3,
        "seven_day_streak": 7,
        "century_coder": 100,
    }
    unlocked = []
    for code, needed in thresholds.items():
        if progress.get(code, 0) >= needed:
            try:
                ach = Achievement.objects.get(code=code)
            except Achievement.DoesNotExist:
                continue
            ua, created = UserAchievement.objects.get_or_create(
                user=user, achievement=ach, defaults={"progress": needed}
            )
            if created:
                unlocked.append(ach)
            else:
                ua.progress = needed
                ua.save(update_fields=["progress"])
    return unlocked


@transaction.atomic
def handle_accepted_submission(user, problem, runtime=None):
    """Award XP only on first solve; update stats, streak, achievements."""
    profile, _ = Profile.objects.select_for_update().get_or_create(user=user)
    up, _ = UserProblem.objects.select_for_update().get_or_create(user=user, problem=problem)
    up.attempts += 1
    first_solve = False
    xp_gained = 0
    coins_gained = 0

    if not up.solved:
        up.solved = True
        up.first_solved_at = timezone.now()
        up.best_runtime = runtime
        up.save()
        first_solve = True
        xp_gained = problem.xp_reward
        coins_gained = COIN_REWARDS.get(problem.difficulty, 50)
        award_xp(user, xp_gained, f"Solved: {problem.title}", problem=problem)
        award_coins(user, coins_gained, f"Masala yechildi ({problem.difficulty.capitalize()}): {problem.title}", "problem_solve")
        profile.refresh_from_db()
        profile.problems_solved += 1
        profile.accepted_submissions += 1
        profile.total_submissions += 1
        profile.save()
        update_streak(user, xp_earned=xp_gained)
    else:
        if runtime is not None and (up.best_runtime is None or runtime < up.best_runtime):
            up.best_runtime = runtime
        up.save()
        # Coin faqat birinchi yechim uchun beriladi, aks holda qayta yuborib cheksiz coin yig'ish mumkin
        profile.refresh_from_db()
        profile.accepted_submissions += 1
        profile.total_submissions += 1
        profile.save(update_fields=["accepted_submissions", "total_submissions", "updated_at"])

    bump_activity(user)
    achievements = check_achievements(user)
    profile.refresh_from_db()
    return {
        "first_solve": first_solve,
        "xp_gained": xp_gained,
        "coins_gained": coins_gained,
        "total_coins": profile.coins,
        "achievements": [a.code for a in achievements],
    }


def handle_failed_submission(user):
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.total_submissions += 1
    profile.save(update_fields=["total_submissions", "updated_at"])
    bump_activity(user)
