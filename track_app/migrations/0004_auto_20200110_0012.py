# Generated by Django 3.0.1 on 2020-01-09 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('track_app', '0003_project_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='avatar',
            field=models.ImageField(blank=True, default='default.jpg', null=True, upload_to='project_avatars'),
        ),
    ]
