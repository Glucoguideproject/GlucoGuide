# Generated by Django 5.1.1 on 2024-10-13 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_alter_userprofile_gl_unit'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='diabetes_risk',
            field=models.CharField(default='', max_length=255),
        ),
    ]
