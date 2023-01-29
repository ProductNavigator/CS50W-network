from .models import Post, User, Follows
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Post 
        fields=['id', 'text', 'time', 'user', 'likes']


class FollowSerializer(serializers.ModelSerializer):
    person = serializers.StringRelatedField()
    follows = serializers.StringRelatedField()
    class Meta:
        model = Follows 
        fields=['id', 'person', 'follows']
