# Generated by Django 5.1.1 on 2024-10-10 12:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_entry'),
    ]

    operations = [
        migrations.RenameField(
            model_name='entry',
            old_name='Glucose_level',
            new_name='glucose_level',
        ),
    ]
