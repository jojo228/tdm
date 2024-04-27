from rest_framework.generics import (ListCreateAPIView,RetrieveUpdateDestroyAPIView,)
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from api.permissions import IsOwnerProfileOrReadOnly
from profiles.serializers import UserRegisterSerializer
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import login, authenticate
import json
import requests

from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.http import Http404
  
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
  
from profiles.serializers import UserRegisterSerializer
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    # Replace the serializer with your custom
    serializer_class = CustomTokenObtainPairSerializer  



#Class based view to register user
class RegisterUserAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer
    def post(self, request):
        user = request.data
        serializer = UserRegisterSerializer(data=user)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login        
class LoginObtainTokenPairView(TokenObtainPairView):
    # customize the Obtain Token Pair view
    serializer_class = CustomTokenObtainPairSerializer 
     
   