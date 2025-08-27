from django.db import models
from django.contrib.auth.models import User

class WasteUpload(models.Model):
    CATEGORY_CHOICES = [
        ('Organic', 'Organic'),
        ('Recyclable', 'Recyclable'),
        ('Hazardous', 'Hazardous'),
        ('Other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.file.name}"
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.points} points"
