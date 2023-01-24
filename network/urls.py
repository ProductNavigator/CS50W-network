
from django.urls import path, include
from rest_framework import routers
from . import views
from .views import PostViewSet

router = routers.DefaultRouter()
router.register(r'Post', PostViewSet)

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("api/", include(router.urls)),
]

##Shoudl I add below line to urlpatterns???
#path("api/auth", include('rest_framework.urls', namespace='rest_framework'))