# Generated by Django 5.0.2 on 2024-03-12 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0004_rename_candidate_name_lselection_candidate"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lselection",
            name="candidate_position",
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name="lselection",
            name="margin_percentage",
            field=models.FloatField(),
        ),
    ]