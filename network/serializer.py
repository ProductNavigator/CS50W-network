from .models import Post
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Post 
        fields=['id', 'text', 'time', 'user', 'likes']