from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def __str__(self):
        return f"{self.username}"


class Post(models.Model):
    text = models.CharField(max_length=10000)
    time = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted_post")
    likes = models.IntegerField(default=0)

class Follows(models.Model):
    person = models.ForeignKey(User, on_delete=models.CASCADE,related_name="following")
    follows = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")