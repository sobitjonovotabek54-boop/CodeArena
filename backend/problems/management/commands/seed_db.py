from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
import random

from accounts.models import Profile
from gamification.models import (
    Achievement,
    ActivityDay,
    CodingStreak,
    CoinTransaction,
    ShopItem,
    UserAchievement,
    UserPurchase,
    XPTransaction,
)
from problems.models import Category, Problem, TestCase, UserProblem
from problems.seed_data import PROBLEMS, STARTER
from submissions.models import Submission

User = get_user_model()

CATEGORIES = [
    ("Arrays", "arrays", "layers"),
    ("Strings", "strings", "type"),
    ("Algorithms", "algorithms", "cpu"),
    ("Data Structures", "data-structures", "database"),
    ("Math", "math", "sigma"),
    ("Sorting", "sorting", "arrow-up-down"),
    ("Searching", "searching", "search"),
    ("Dynamic Programming", "dynamic-programming", "git-branch"),
    ("Graphs", "graphs", "share-2"),
    ("Recursion", "recursion", "repeat"),
]

ACHIEVEMENTS = [
    ("first_blood", "First Blood", "Solve your first problem", "droplet", 1),
    ("ten_problems", "10 Problems", "Solve 10 problems", "hash", 10),
    ("algorithm_master", "Algorithm Master", "Solve 5 algorithm problems", "brain", 5),
    ("hard_coder", "Hard Coder", "Solve 3 hard problems", "flame", 3),
    ("seven_day_streak", "7 Day Streak", "Maintain a 7-day coding streak", "calendar", 7),
    ("century_coder", "Century Coder", "Solve 100 problems", "trophy", 100),
]

SHOP_ITEMS = [
    (
        "frame_neon_cyan",
        "Neon Kiber Ramka",
        "Moviy neon nurlanishga ega bo'lgan kiberpank uslubidagi avatar ramkasi.",
        "frame",
        300,
        "sparkles",
        "rare",
        {"borderColor": "#06b6d4", "boxShadow": "0 0 15px #06b6d4", "badge": "Neon Cyan"},
    ),
    (
        "frame_gold_crown",
        "Oltin Qirollik Toji",
        "Yetakchilar va chempionlar uchun maxsus oltin toj va zarhal ramka.",
        "frame",
        700,
        "crown",
        "epic",
        {"borderColor": "#eab308", "boxShadow": "0 0 20px #eab308", "badge": "Gold Crown"},
    ),
    (
        "frame_matrix_green",
        "Zaharli Matrix Ramka",
        "Haqiqiy xakerlar uchun yashil terminal matritsasi effektli avatar hoshiyasi.",
        "frame",
        500,
        "terminal",
        "rare",
        {"borderColor": "#22c55e", "boxShadow": "0 0 15px #22c55e", "badge": "Matrix"},
    ),
    (
        "frame_flame_phoenix",
        "Olovli Feniks",
        "Afsanaviy yonuvchi olov effekti. Yuqori streakli dasturchilar faxri.",
        "frame",
        1200,
        "flame",
        "legendary",
        {"borderColor": "#ef4444", "boxShadow": "0 0 25px #f97316", "badge": "Phoenix"},
    ),
    (
        "title_python_ninja",
        "Python Ninja",
        "Yengilmas va chaqqon Python algoritmlari ustasi.",
        "title",
        250,
        "code",
        "common",
        {"textColor": "#38bdf8", "bgGradient": "from-sky-500/20 to-blue-500/20"},
    ),
    (
        "title_bug_hunter",
        "Bug Hunter",
        "Eng murakkab xatoliklarni bir zumda topib tuzatuvchi ovchi.",
        "title",
        400,
        "shield",
        "rare",
        {"textColor": "#a855f7", "bgGradient": "from-purple-500/20 to-pink-500/20"},
    ),
    (
        "title_code_wizard",
        "Code Wizard",
        "Murakkab algoritmlarni sehr kabi yechuvchi buyuk dasturchi.",
        "title",
        800,
        "sparkles",
        "epic",
        {"textColor": "#f59e0b", "bgGradient": "from-amber-500/20 to-yellow-500/20"},
    ),
    (
        "title_grand_champion",
        "Grand Champion",
        "CodeArena musobaqalarining eng yuqori darajadagi mutlaq g'olibi.",
        "title",
        1500,
        "trophy",
        "legendary",
        {"textColor": "#ec4899", "bgGradient": "from-rose-500/20 to-pink-500/20"},
    ),
    (
        "theme_cyberpunk",
        "Cyberpunk Neon IDE",
        "Monaco kod muharriri uchun binafsha va zumrad rangli kiberpank mavzusi.",
        "theme",
        600,
        "palette",
        "epic",
        {"themeId": "cyberpunk-neon", "accent": "#a855f7"},
    ),
    (
        "theme_matrix_hacker",
        "Matrix Terminal IDE",
        "Klassik qora-yashil matritsa kod muharriri uslubi.",
        "theme",
        500,
        "terminal",
        "rare",
        {"themeId": "matrix-green", "accent": "#22c55e"},
    ),
    (
        "theme_monokai_pro",
        "Monokai Pro Dark",
        "Ko'zni charchatmaydigan professional dasturchilar standarti.",
        "theme",
        450,
        "palette",
        "rare",
        {"themeId": "monokai-pro", "accent": "#eab308"},
    ),
    (
        "booster_streak_shield",
        "Streak Qalqoni (Freeze)",
        "Kunlik seriyangiz (streak) uzilib qolishidan himoya qiluvchi xavfsizlik qalqoni.",
        "booster",
        350,
        "shield",
        "rare",
        {"type": "streak_freeze", "uses": 1},
    ),
    (
        "booster_hint_token",
        "Maslahat Tokeni (Hint Token)",
        "Qiyin algoritmik masalalarda optimal yondashuv bo'yicha maslahat ochish tokeni.",
        "booster",
        150,
        "zap",
        "common",
        {"type": "problem_hint", "uses": 1},
    ),
]


class Command(BaseCommand):
    help = "Seed CodeArena with categories, 30 problems, users, achievements"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Seeding CodeArena...")

        cats = {}
        for name, slug, icon in CATEGORIES:
            cat, _ = Category.objects.update_or_create(
                slug=slug, defaults={"name": name, "icon": icon, "description": f"{name} problems"}
            )
            cats[slug] = cat

        for code, title, desc, icon, thr in ACHIEVEMENTS:
            Achievement.objects.update_or_create(
                code=code,
                defaults={"title": title, "description": desc, "icon": icon, "threshold": thr},
            )

        easy = medium = hard = 0
        for p in PROBLEMS:
            cat = cats[p["category"]]
            xp = Problem.XP_MAP[p["difficulty"]]
            problem, created = Problem.objects.update_or_create(
                slug=p["title"].lower().replace(" ", "-").replace("(", "").replace(")", "").replace(",", ""),
                defaults={
                    "title": p["title"],
                    "description": p["description"],
                    "difficulty": p["difficulty"],
                    "category": cat,
                    "xp_reward": xp,
                    "constraints": p["constraints"],
                    "input_format": p["input_format"],
                    "output_format": p["output_format"],
                    "examples": p["examples"],
                    "starter_code": STARTER,
                    "is_active": True,
                },
            )
            # fix slug via title slugify path - update_or_create used custom slug
            problem.test_cases.all().delete()
            for i, t in enumerate(p["tests"]):
                TestCase.objects.create(
                    problem=problem,
                    input_data=t["input"],
                    expected_output=t["output"],
                    is_sample=t.get("sample", False),
                    is_hidden=not t.get("sample", False),
                    order=i,
                )
            if p["difficulty"] == "easy":
                easy += 1
            elif p["difficulty"] == "medium":
                medium += 1
            else:
                hard += 1

        # Mark first easy as daily challenge
        first_easy = Problem.objects.filter(difficulty="easy").first()
        if first_easy:
            Problem.objects.update(is_daily_challenge=False)
            first_easy.is_daily_challenge = True
            first_easy.save(update_fields=["is_daily_challenge"])

        # Seed Shop Items
        for item_id, title, desc, cat, price, icon, rarity, preview in SHOP_ITEMS:
            ShopItem.objects.update_or_create(
                item_id=item_id,
                defaults={
                    "title": title,
                    "description": desc,
                    "category": cat,
                    "price": price,
                    "icon": icon,
                    "rarity": rarity,
                    "preview_data": preview,
                    # Hint token hali hech qanday effektga ega emas, shuning uchun sotuvda yo'q
                    "is_active": item_id != "booster_hint_token",
                },
            )

        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@codearena.dev", "is_admin": True, "is_staff": True, "is_superuser": True},
        )
        if created:
            admin.set_password("admin123")
            admin.save()
        else:
            admin.is_admin = True
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()
        admin_prof, _ = Profile.objects.get_or_create(user=admin)
        admin_prof.coins = 2500
        admin_prof.save()

        demo_users = [
            ("alice", "alice@codearena.dev", "pass1234", 120, 8, 1150, "frame_neon_cyan", "title_python_ninja"),
            ("bob", "bob@codearena.dev", "pass1234", 85, 5, 800, "frame_matrix_green", "title_bug_hunter"),
            ("carol", "carol@codearena.dev", "pass1234", 200, 12, 1750, "frame_gold_crown", "title_code_wizard"),
            ("dave", "dave@codearena.dev", "pass1234", 45, 3, 450, "", "title_python_ninja"),
            ("erin", "erin@codearena.dev", "pass1234", 310, 15, 2300, "frame_flame_phoenix", "title_grand_champion"),
        ]
        problems = list(Problem.objects.all())
        for username, email, password, xp, solved_n, coins, frame, title_item in demo_users:
            user, created = User.objects.get_or_create(username=username, defaults={"email": email})
            if created:
                user.set_password(password)
                user.save()
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.xp = xp
            profile.coins = coins
            profile.equipped_frame = frame
            profile.equipped_title = title_item
            profile.recalculate_level()
            profile.bio = f"Competitive coder · @{username}"
            profile.avatar_url = f"https://api.dicebear.com/7.x/identicon/svg?seed={username}"
            profile.current_streak = random.randint(1, 7)
            profile.longest_streak = max(profile.current_streak, random.randint(5, 14))
            profile.last_solved_date = timezone.now().date()
            profile.problems_solved = 0
            profile.save()

            # Assign purchases for equipped items
            if frame:
                try:
                    f_item = ShopItem.objects.get(item_id=frame)
                    UserPurchase.objects.get_or_create(user=user, item=f_item, defaults={"is_equipped": True})
                except ShopItem.DoesNotExist:
                    pass
            if title_item:
                try:
                    t_item = ShopItem.objects.get(item_id=title_item)
                    UserPurchase.objects.get_or_create(user=user, item=t_item, defaults={"is_equipped": True})
                except ShopItem.DoesNotExist:
                    pass

            for problem in random.sample(problems, min(solved_n, len(problems))):
                UserProblem.objects.update_or_create(
                    user=user,
                    problem=problem,
                    defaults={"solved": True, "first_solved_at": timezone.now(), "attempts": random.randint(1, 5)},
                )
                Submission.objects.create(
                    user=user,
                    problem=problem,
                    language="python",
                    code="# demo\nprint('ok')\n",
                    status="accepted",
                    runtime=random.uniform(1, 50),
                    memory=12.0,
                    passed_tests=2,
                    total_tests=2,
                    is_run_only=False,
                )
                XPTransaction.objects.get_or_create(
                    user=user,
                    problem=problem,
                    reason=f"Solved: {problem.title}",
                    defaults={"amount": problem.xp_reward},
                )
                profile.problems_solved += 1
                profile.accepted_submissions += 1
                profile.total_submissions += random.randint(1, 3)
            profile.save()

            for d in range(14):
                day = timezone.now().date() - timedelta(days=d)
                ActivityDay.objects.update_or_create(
                    user=user, date=day, defaults={"count": random.randint(0, 5)}
                )
                if random.random() > 0.3:
                    CodingStreak.objects.update_or_create(
                        user=user,
                        date=day,
                        defaults={"problems_solved": random.randint(1, 3), "xp_earned": random.randint(10, 50)},
                    )

            if profile.problems_solved >= 1:
                ach = Achievement.objects.get(code="first_blood")
                UserAchievement.objects.get_or_create(user=user, achievement=ach)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {easy} easy, {medium} medium, {hard} hard problems, 13 shop items, and coin rewards. "
                f"Admin: admin/admin123 · Demo: alice/pass1234"
            )
        )
