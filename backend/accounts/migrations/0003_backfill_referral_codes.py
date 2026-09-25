import secrets

from django.db import migrations


def backfill_referral_codes(apps, schema_editor):
    Profile = apps.get_model("accounts", "Profile")
    for profile in Profile.objects.filter(referral_code__isnull=True).select_related("user"):
        prefix = "".join(c for c in profile.user.username if c.isalnum())[:6].upper()
        code = f"CA_{prefix}_{secrets.token_hex(3).upper()}"
        while Profile.objects.filter(referral_code=code).exists():
            code = f"CA_{prefix}_{secrets.token_hex(3).upper()}"
        profile.referral_code = code
        profile.save(update_fields=["referral_code"])


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_profile_coins_profile_equipped_frame_and_more"),
    ]

    operations = [
        migrations.RunPython(backfill_referral_codes, migrations.RunPython.noop),
    ]
