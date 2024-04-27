from rest_framework import serializers
from profiles.models import UserProfile 
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password

class UserRegisterSerializer(serializers.ModelSerializer):
    '''
        Model: UserProfile
        Urls : 
            1- api/register
    '''
    
    email = serializers.EmailField(
    required=True,
    validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    id = serializers.CharField(source = 'user.id', read_only=True)
    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'password', 'password2',
            'email', 'first_name', 'last_name', 'mobile_number')
    
        extra_kwargs = {
        'first_name': {'required': True},
        'last_name': {'required': True},
        'password':{'write_only': True},
        }
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        
        user = User.objects.create_user(
        username=validated_data['username'],
        email=validated_data['email'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
        password = validated_data['password']
        )
        user.save()
        
        profile = UserProfile.objects.create(
        user = user,
        username=validated_data['username'],
        email=validated_data['email'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
        password = make_password(validated_data['password']),
        mobile_number = validated_data['mobile_number']
        )
        profile.save()
        return profile
    
    

class UserLoginSerializer(serializers.ModelSerializer):
    '''
        Model: User
        Urls : 
            1- api/login
            2- token/refresh/
            3- token/verify/
    '''
    class Meta:
        model = User
        fields = ['username', 'password']
    
