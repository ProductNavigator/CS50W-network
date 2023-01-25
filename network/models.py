from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    text = models.CharField(max_length=10000)
    time = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted_post")
    likes = models.IntegerField(default=0)