import os

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from accounts.models import Profile, User


class Command(BaseCommand):
    help = (
        "Create or update admin accounts from the ADMIN_USERS env var. "
        'Format: "username:email:password" entries separated by commas, '
        'e.g. ADMIN_USERS="otabek:otabek@mail.com:S3cret!,ali:ali@mail.com:Pa55word"'
    )

    @transaction.atomic
    def handle(self, *args, **options):
        raw = os.getenv("ADMIN_USERS", "").strip()
        if not raw:
            self.stdout.write("ADMIN_USERS is empty, no admins created.")
            return

        for entry in filter(None, (e.strip() for e in raw.split(","))):
            parts = entry.split(":", 2)
            if len(parts) != 3 or not all(parts):
                raise CommandError(f'Invalid ADMIN_USERS entry "{parts[0]}:…": expected username:email:password')
            username, email, password = parts
            if len(password) < 8:
                raise CommandError(f'Password for admin "{username}" must be at least 8 characters.')

            user = User.objects.filter(username=username).first()
            created = user is None
            if created:
                if User.objects.filter(email=email).exists():
                    raise CommandError(f'Email "{email}" is already used by another account.')
                user = User(username=username, email=email)
            user.is_admin = True
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            # Parol har deployda env'dan qayta o'rnatiladi, shuning uchun uni env orqali almashtirish mumkin
            user.set_password(password)
            user.save()
            Profile.objects.get_or_create(user=user)
            self.stdout.write(f"Admin {'created' if created else 'updated'}: {username}")
