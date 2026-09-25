from django.db import transaction
from django.db.models import Sum
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile, User
from gamification.models import CoinTransaction, ShopItem, UserPurchase
from gamification.serializers import CoinTransactionSerializer, ShopItemSerializer, UserPurchaseSerializer
from gamification.services import deduct_coins


class ShopItemListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        items = ShopItem.objects.filter(is_active=True).order_by("category", "price")
        user_purchases = set()
        equipped_items = set()
        user_coins = 0

        if request.user.is_authenticated:
            profile = getattr(request.user, "profile", None)
            if profile:
                user_coins = profile.coins
                if profile.equipped_frame:
                    equipped_items.add(profile.equipped_frame)
                if profile.equipped_title:
                    equipped_items.add(profile.equipped_title)
                if profile.equipped_theme:
                    # check item whose preview_data has themeId
                    for itm in items.filter(category="theme"):
                        if itm.preview_data.get("themeId") == profile.equipped_theme:
                            equipped_items.add(itm.item_id)

            user_purchases = set(
                UserPurchase.objects.filter(user=request.user).values_list("item__item_id", flat=True)
            )

        serializer = ShopItemSerializer(
            items,
            many=True,
            context={"user_purchases": user_purchases, "equipped_items": equipped_items},
        )
        return Response(
            {
                "items": serializer.data,
                "user_coins": user_coins,
            }
        )


class ShopBuyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        item_id = request.data.get("item_id")
        if not item_id:
            return Response({"detail": "Mahsulot tanlanmadi (item_id kerak)."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = ShopItem.objects.get(item_id=item_id, is_active=True)
        except ShopItem.DoesNotExist:
            return Response({"detail": "Bunday mahsulot do'konda topilmadi."}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = Profile.objects.select_for_update().get_or_create(user=request.user)

        # Check if already purchased (except consumable boosters)
        if item.category != "booster":
            if UserPurchase.objects.filter(user=request.user, item=item).exists():
                return Response(
                    {"detail": "Siz bu mahsulotni allaqachon sotib olgansiz."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if profile.coins < item.price:
            return Response(
                {
                    "detail": f"Tangalaringiz yetarli emas! Sizda {profile.coins} coin bor, mahsulot narxi esa {item.price} coin.",
                    "required_coins": item.price,
                    "current_coins": profile.coins,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Deduct coins
        deduct_coins(
            request.user,
            item.price,
            f"Magazindan xarid: {item.title}",
            transaction_type="shop_purchase",
        )

        # Special booster effects
        if item.category == "booster":
            if item.item_id == "booster_streak_shield":
                profile.streak_shields += 1
                profile.save(update_fields=["streak_shields", "updated_at"])

        # Record purchase
        purchase, _ = UserPurchase.objects.get_or_create(user=request.user, item=item)

        # Auto-equip if first frame/title/theme
        if item.category == "frame" and not profile.equipped_frame:
            profile.equipped_frame = item.item_id
            profile.save(update_fields=["equipped_frame", "updated_at"])
            purchase.is_equipped = True
            purchase.save(update_fields=["is_equipped"])
        elif item.category == "title" and not profile.equipped_title:
            profile.equipped_title = item.item_id
            profile.save(update_fields=["equipped_title", "updated_at"])
            purchase.is_equipped = True
            purchase.save(update_fields=["is_equipped"])
        elif item.category == "theme" and profile.equipped_theme == "vs-dark":
            profile.equipped_theme = item.preview_data.get("themeId", "vs-dark")
            profile.save(update_fields=["equipped_theme", "updated_at"])
            purchase.is_equipped = True
            purchase.save(update_fields=["is_equipped"])

        profile.refresh_from_db()

        return Response(
            {
                "success": True,
                "message": f"Tabriklaymiz! '{item.title}' muvaffaqiyatli sotib olindi!",
                "item_id": item.item_id,
                "remaining_coins": profile.coins,
                "is_equipped": purchase.is_equipped,
            },
            status=status.HTTP_200_OK,
        )


class ShopEquipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        item_id = request.data.get("item_id")
        action = request.data.get("action", "equip")  # "equip" or "unequip"

        if not item_id:
            return Response({"detail": "item_id talab qilinadi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = ShopItem.objects.get(item_id=item_id, is_active=True)
        except ShopItem.DoesNotExist:
            return Response({"detail": "Mahsulot topilmadi."}, status=status.HTTP_404_NOT_FOUND)

        try:
            purchase = UserPurchase.objects.get(user=request.user, item=item)
        except UserPurchase.DoesNotExist:
            return Response(
                {"detail": "Siz bu mahsulotni hali sotib olmagansiz."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile, _ = Profile.objects.select_for_update().get_or_create(user=request.user)

        if action == "equip":
            # Unequip others in same category
            UserPurchase.objects.filter(user=request.user, item__category=item.category).update(is_equipped=False)
            purchase.is_equipped = True
            purchase.save(update_fields=["is_equipped"])

            if item.category == "frame":
                profile.equipped_frame = item.item_id
                profile.save(update_fields=["equipped_frame", "updated_at"])
            elif item.category == "title":
                profile.equipped_title = item.item_id
                profile.save(update_fields=["equipped_title", "updated_at"])
            elif item.category == "theme":
                profile.equipped_theme = item.preview_data.get("themeId", "vs-dark")
                profile.save(update_fields=["equipped_theme", "updated_at"])

            msg = f"'{item.title}' muvaffaqiyatli faollashtirildi!"
        else:
            purchase.is_equipped = False
            purchase.save(update_fields=["is_equipped"])

            if item.category == "frame" and profile.equipped_frame == item.item_id:
                profile.equipped_frame = ""
                profile.save(update_fields=["equipped_frame", "updated_at"])
            elif item.category == "title" and profile.equipped_title == item.item_id:
                profile.equipped_title = ""
                profile.save(update_fields=["equipped_title", "updated_at"])
            elif item.category == "theme":
                profile.equipped_theme = "vs-dark"
                profile.save(update_fields=["equipped_theme", "updated_at"])

            msg = f"'{item.title}' faollashtirishdan olindi."

        profile.refresh_from_db()

        return Response(
            {
                "success": True,
                "message": msg,
                "equipped_frame": profile.equipped_frame,
                "equipped_title": profile.equipped_title,
                "equipped_theme": profile.equipped_theme,
            },
            status=status.HTTP_200_OK,
        )


class UserInventoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        purchases = UserPurchase.objects.select_related("item").filter(user=request.user)
        transactions = CoinTransaction.objects.filter(user=request.user)[:30]
        profile, _ = Profile.objects.get_or_create(user=request.user)

        return Response(
            {
                "coins": profile.coins,
                "equipped_frame": profile.equipped_frame,
                "equipped_title": profile.equipped_title,
                "equipped_theme": profile.equipped_theme,
                "streak_shields": profile.streak_shields,
                "purchases": UserPurchaseSerializer(purchases, many=True).data,
                "transactions": CoinTransactionSerializer(transactions, many=True).data,
            }
        )


class ReferralInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)

        # Get all users who joined with this referral code
        referrals = (
            User.objects.filter(profile__referred_by=request.user)
            .select_related("profile")
            .order_by("-date_joined")
        )

        total_earned = (
            CoinTransaction.objects.filter(
                user=request.user, transaction_type="referral_bonus"
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )

        friends_data = []
        for u in referrals:
            friends_data.append(
                {
                    "id": u.id,
                    "username": u.username,
                    "level": u.profile.level,
                    "xp": u.profile.xp,
                    "avatar_url": u.profile.avatar_url,
                    "date_joined": u.date_joined,
                    "reward_coins": 500,
                }
            )

        return Response(
            {
                "referral_code": profile.referral_code,
                "total_referrals": len(friends_data),
                "total_earned_coins": total_earned,
                "reward_per_referral": 500,
                "welcome_bonus": 100,
                "referrals": friends_data,
            }
        )
