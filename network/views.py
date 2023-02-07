from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Post, Follows 
from rest_framework import viewsets
from .serializer import PostSerializer, FollowSerializer
from datetime import datetime
import logging
from django import forms
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import logging
import json 


def index(request):
    if request.method == "POST":
        user_id = request.user.id
        user = User.objects.get(pk=user_id)    
        form = Create(request.POST)
        if form.is_valid():
            text = form.cleaned_data["text"]
            time = datetime.now()
            #create new Post
            p = Post(user = user, text = text, time = time)
            logging.debug(p)
            p.save()
            return HttpResponseRedirect(reverse("network:index"))
        else:
            return HttpResponseRedirect(reverse("network:index"))
    else:
        posts = Post.objects.all()
        paginator = Paginator(posts, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, "network/index.html", {
                "create": Create(),
                "posts": posts,
                'page_obj': page_obj,
            })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("network:index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("network:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("network:index"))
    else:
        return render(request, "network/register.html")

def following (request):
    user_which_acts = User.objects.get(pk=request.user.id)
    user1 = user_which_acts.username
    return render(request, "network/following.html", {
        "user1": user1,
        })

@csrf_protect
def profile (request, user_name):
    user = User.objects.get(username=user_name)
    user_which_acts = User.objects.get(pk=request.user.id)
    if request.method == "POST":
        check = request.POST.get("buttoncheck")
        
        if check == "follow": 
            f = Follows(person=user_which_acts, follows=user)
            f.save()
            return HttpResponseRedirect(reverse("network:index"))
        elif check == "unfollow": 
            f = Follows.objects.get(person=user_which_acts, follows=user)
            f.delete()
            return HttpResponseRedirect(reverse("network:index"))
        else:
            return render(request, "network/error.html")
    else:
        #getting followers of user 
        followers = (user.followers.all()).count
        #getting people user follows
        following = (user.following.all()).count

        #Showing buttons to follow/unfollow###
        user_see = request.user

        #Check if this is me:
        if user == request.user:
            tofollow = "hidden"
            tounfollow = "hidden"
        
        #check which button to show:
        else:
            match = (user_see.following.all()).filter(follows=user)
            counting = match.count()
            if counting > 0:
                tofollow = "hidden"
                tounfollow = ""
            else: 
                tofollow = ""
                tounfollow = "hidden"

        return render(request, "network/profile.html", {
            "followers": followers,
            "following": following,
            "tofollow": tofollow,
            "tounfollow": tounfollow,
            "profile": user,
            "user_name":user_name
            })

@csrf_exempt
def likes(request, post_id):
    post = Post.objects.get(pk=post_id)
    data = json.loads(request.body)
    print(data)
    if data == True:
        post.likes = post.likes + 1
    else:
        post.likes = post.likes - 1
    post.save()
    return HttpResponse('It was updated', content_type='text/plain')

@csrf_exempt
def editpost(request, post_id):
    post = Post.objects.get(pk=post_id)
    databeta = str(request.body)
    data = databeta[2:-1]
    print(data)
    post.text = data
    post.save()
    return HttpResponse('It was updated', content_type='text/plain')


@api_view(['GET'])
def current_user(request):
    user = request.user
    return JsonResponse({
      'username' : user.username,
      'id' : user.id,
    })

def user(request):
    user = request.user.username
    return HttpResponse(user, content_type='text/plain')

class PostViewSet (viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
class FollowsViewSet (viewsets.ModelViewSet):
    queryset = Follows.objects.all()
    serializer_class = FollowSerializer

class Create(forms.Form):
    text = forms.CharField(max_length=1000000, label="New Post", widget=forms.Textarea(attrs={"class":"input", "rows":"2"}))

