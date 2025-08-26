from django.db import models
from django.contrib.auth.models import User

# Waste Categories
class WasteCategory(models.TextChoices):
    BIODEGRADABLE = 'biodegradable', 'Biodegradable'
    RECYCLABLE = 'recyclable', 'Recyclable'
    HAZARDOUS = 'hazardous', 'Hazardous'

# Waste Item
class WasteItem(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=WasteCategory.choices)
    image = models.ImageField(upload_to='waste_images/', blank=True, null=True)

    def __str__(self):
        return self.name

# User Points (needed for Feature 4)
class UserPoints(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
