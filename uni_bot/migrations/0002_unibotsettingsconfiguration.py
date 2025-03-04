# Generated by Django 4.2.13 on 2024-10-17 19:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('uni_bot', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UniBotSettingsConfiguration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('change_date', models.DateTimeField(auto_now_add=True, verbose_name='Change date')),
                ('enabled', models.BooleanField(default=False, verbose_name='Enabled')),
                ('config_values', jsonfield.fields.JSONField(blank=True, default=dict, verbose_name='Configuration values')),
                ('changed_by', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Changed by')),
            ],
            options={
                'verbose_name': 'UniBot settings configuration',
                'verbose_name_plural': 'UniBot settings configurations',
            },
        ),
    ]
