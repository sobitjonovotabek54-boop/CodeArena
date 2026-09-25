from django.db import migrations


def deactivate_hint_token(apps, schema_editor):
    ShopItem = apps.get_model("gamification", "ShopItem")
    ShopItem.objects.filter(item_id="booster_hint_token").update(is_active=False)


class Migration(migrations.Migration):
    dependencies = [
        ("gamification", "0002_shopitem_cointransaction_userpurchase"),
    ]

    operations = [
        migrations.RunPython(deactivate_hint_token, migrations.RunPython.noop),
    ]
