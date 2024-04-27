from rest_framework import serializers
from .models import HotelData, HotelUser, Role
from django.apps import apps
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password

from .models import PettyCash
from sales.models import Bill, PaymentCategory
from datetime import date

# Getting the Django User model 
User=get_user_model()
UserProfile = apps.get_model('profiles', 'UserProfile')

class OwnerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email'
        ]    


class ParentHotelSerializer(serializers.ModelSerializer):
    owner_details = OwnerDetailsSerializer(source='owner', read_only=True)
    class Meta:
        model = HotelData
        fields = [
            'hotel_id',
            'owner_details',
            'contact_number',
            'address',
            'location'
            
        ]
# ----------------------------------------------------------------------------------------#
#               Serializer for Model: HotelData Url:                                      #
#-----------------------------------------------------------------------------------------#
class HotelsSerializer(serializers.ModelSerializer):
    
    '''
        Model: HotelData
        Urls : 
            1- hotel_update/<int:pk>/
            2- create_hotel/
            3-hotel_info/<int:pk>/
    '''
    owner_details = OwnerDetailsSerializer(source='owner', read_only=True)
    parent_details = ParentHotelSerializer(source='parent', read_only=True)
    class Meta:
        model = HotelData
        fields = [
            'hotel_id',
            'hotel_name', 
            'owner',
            'owner_details',
            'contact_number',
            'hotel_type',
            'location',
            'status',
            'address',
            'web_site',
            'facebook_link',
            'instagram_link',
            'parent',
            'parent_details'
            
        ]
        lookup_fields = 'hotel_id'
        
        # def create(self, validated_data):
        #     HotelUser.objects.create(user=user, role_id=role_id[0], **validated_data)
        #     owner = validated_data.get('owner')


class HotelDetailSerializer(serializers.ModelSerializer):
    '''
        Model: HotelData
        Urls : 
            1- hotels/
    '''
    
    website = serializers.CharField(source='web_site',read_only=True)
    facebook = serializers.CharField(source='facebook_link',read_only=True)
    instagram = serializers.CharField(source='instagram_link',read_only=True)
    owner_details = OwnerDetailsSerializer(source='owner', read_only=True)
    parent_details = ParentHotelSerializer(source='parent', read_only=True)
    class Meta:
        model = HotelData
        fields = [
            'hotel_id',
            'hotel_name', 
            'owner',
            'owner_details',
            'hotel_type',
            'location',
            'contact_number',
            'address',
            'website',
            'facebook',
            'instagram',
            'parent',
            'parent_details'
            
        ]
        

# ----------------------------------------------------------------------------------------#
#               Serializer for HotelOutles:                                               #
#                           Url:hotel_outlets                                             #
#-----------------------------------------------------------------------------------------#
class HotelOutletsSerializer(serializers.ModelSerializer):
    
    '''
        Model: HotelData
        Urls : 
            1- hotel_outlets/
    '''
    owner_details = OwnerDetailsSerializer(source='owner', read_only=True)
    class Meta:
        model = HotelData
        fields = [
            'hotel_id',
            'hotel_name', 
            'contact_number',
            'location',
            'address',
            'owner',
            'owner_details',         
        ]
        lookup_fields = 'hotel_id'
        

class UserProfileSerializer(serializers.ModelSerializer):
    
    '''
        Model: UserProfile
        Urls : 
            1- Login
            2- Register

    '''
    
    id = serializers.CharField(source = 'user.id', read_only=True) 
    class Meta:
        model = UserProfile
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'mobile_number'
        ] 
        
    
    
class RoleSerializer(serializers.ModelSerializer): 
    '''
        Model: Role
        Urls : 
            1- URL : roles/
    '''
    class Meta:
        model = Role
        fields = ['role_id','role_name']
        
class RolesSerializer(serializers.ModelSerializer):
    '''
        Model: Role
        Urls : 
            1- URL : roles/
    '''
    class Meta:
        model = Role
        fields = '__all__'
        
    
    
class UsernameSerializer(serializers.ModelSerializer):
    model = User
    fied = ('username',)
        
        
class UserWithPasswordSerializer(serializers.ModelSerializer):
    '''
        This is a protected class that is acting as internal serializer on the model User.
        It will require all the fields in the User model.
        Hence It's protected because it contain a password that is sensitive data.
        
    '''
    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'first_name',
            'last_name',
        ]
        extra_kwargs = {'id': {'read_only': False, 'required': True}}
        
        
class UserWithUsernameSerializer(serializers.ModelSerializer):
    '''
        This is a protected class that is acting as internal serializer on the model User.
        It will require all the fields in the User model.
        Hence It's protected because it contain a password that is sensitive data.
        
    '''
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
        ]
        extra_kwargs = {'id': {'read_only': False, 'required': True}}
        
        
        
class HotelOwnerSerializer(serializers.ModelSerializer):
    '''
        Model: HotelUser
        Urls : 
            1- URL : /hotel/?id=1&user=owner
    '''
    user = UserWithUsernameSerializer(many=False)
    role = RoleSerializer(many=False, source='role_id', read_only=True)
    class Meta:
        model = HotelUser
        fields = [
            'id',
            'hotel_id',
            'role',
            'user',
            'mobile_number'
        ]
        lookup_field = 'id'

        
        
class HotelUserWithoutPasswordSerializer(serializers.ModelSerializer):
    '''
        Model: HotelUser
        Urls : 
            1- URL : /hotel/?id=1&user=owner
    '''
    user = UserWithPasswordSerializer(many=False)
    role = RoleSerializer(many=False, source='role_id', read_only=True)
    class Meta:
        model = HotelUser
        fields = [
            'id',
            'hotel_id',
            'role',
            'user',
            'mobile_number'
        ]
        lookup_field = 'id'
        
    def update(self, instance, validated_data):
        user = validated_data.pop('user')  
        owner = User.objects.get(email=user['email'])
        owner.first_name = user.get('first_name', owner.first_name)
        owner.last_name = user.get('last_name', owner.last_name)
        owner.email = user.get('email', owner.email)
        owner.password = make_password(user['password'])
        owner.save()
        instance.mobile_number = validated_data['mobile_number']
        
        user_profile = UserProfile.objects.get(email = user['email'])
    
        user_profile.first_name = user.get('first_name', owner.first_name)
        user_profile.last_name = user.get('last_name', owner.last_name)
        user_profile.email = user.get('email', owner.email)
        user_profile.password = make_password(user['password'])
        user_profile.mobile_number = validated_data['mobile_number']
        user_profile.save()
        
        HotelUser.objects.update(mobile_number = validated_data['mobile_number'])
        
        return instance
            
      
class HotelUserSerializer(serializers.ModelSerializer):
    '''
        Model: HotelUser
        Urls : 
            1- URL : hotel_employee/create/
    '''
    user = UserWithUsernameSerializer(many=False)
    role = RoleSerializer(many=False, source='role_id')
    class Meta:
        model = HotelUser
        fields = [
            'hotel_id',
            'role',
            'user',
            'mobile_number'
        ]

    def create(self, validated_data):
        role = validated_data.pop('role_id')
        profile = validated_data.pop('user')
        role_id = Role.objects.get_or_create(hotel_id=validated_data['hotel_id'], **role)
        # Create each related role instance
        # check if the user is already existed or not
        user = User.objects.filter(email=profile['email'])
        print(user)
        if user.exists():
            print("YES")
            hotel_user = HotelUser.objects.create(user=user[0], role_id=role_id[0], **validated_data)
        else:
            # user = User.objects.create_user(**profile)   
            # // This is not working because the password is set null because of raw passwork assigned
            details = {             
                    "username" : profile['username'],
                    "email" : profile['email'],
                    "password" : make_password(profile['password']),
                    "first_name" : profile['first_name'],
                    "last_name" : profile['last_name']
                }
            user = User.objects.create_user(**profile)
            user.save()
            
            user_profile = UserProfile.objects.create(
                user=user, 
                mobile_number = validated_data['mobile_number'],
                status="active",
                **details)
            user_profile.save()
            
        
            hotel_user = HotelUser.objects.create(user=user, role_id=role_id[0], **validated_data)
        

        return hotel_user
    
        
    def update(self, instance, validated_data):
        owner = validated_data.pop('user')
        user = User.objects.get(email=owner['email'])
        user.username= owner.get('username', user.username)
        user.first_name= owner.get('first_name', user.first_name)
        user.last_name = owner.get('last_name', user.last_name)
        user.email = owner.get('email', user.email)
        
        user.save()
        
        

        return instance
    

class HotelUserRolesSerializer(serializers.ModelSerializer):
    '''
        Model: HotelUser
        Urls : 
            1- URL : roles/
            2- URL : hotel_roles/?hotel=1
    '''
            
    role = serializers.CharField(source='role_id')
    
    class Meta:
        model = HotelUser
        fields = ['role_id', 'role']
        
        
        
#------------------------------------------------------------------------------------#
#                 These serializers will be used in Expense Tracking                 #
#------------------------------------------------------------------------------------#
#---------------------------------------START----------------------------------------#
class UserSalaraySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
        ]
class HotelUserForSalary_Serializer(serializers.ModelSerializer):
    user = UserSalaraySerializer(many=False)
    role = RoleSerializer(many=False, source='role_id')
    class Meta:
        model = HotelUser
        fields = [
            'hotel_id',
            'role',
            'user',
            'mobile_number'
        ]
#-----------------------------------------END---------------------------------------#

  
class PettyCashSerializer(serializers.ModelSerializer):
    '''
        Model: PettyCash
        Urls : 
            1- URL : update/
    '''
    class Meta:
        model = PettyCash
        fields = '__all__'
        
    lookup_field = 'id'
    def update(self, instance, validated_data):
        last_closing = PettyCash.objects.filter(hotel=validated_data['hotel']).last().closing_balance
        # Check if it is the first time the are using the pettycash
        pay_type_id = PaymentCategory.objects.get(hotel=validated_data['hotel'], name='cash').id
        bills = Bill.objects.filter(
            hotel_id=validated_data['hotel'], 
            bill_status='paid',
            created_at__startswith=date.today().strftime("%Y-%m-%d"),
            payment_type = pay_type_id
        )
        inital_balance = PettyCash.objects.filter(hotel=validated_data['hotel']).last().initial_balance 
        last_closing = inital_balance + validated_data['opening_amount'] + sum([sold.net_amount for sold in bills]) - validated_data['outgoing_amount']
        instance.opening_amount = validated_data['opening_amount']
        instance.incoming_amount = sum([sold.net_amount for sold in bills])
        instance.outgoing_amount = validated_data['outgoing_amount']
        instance.closing_balance = last_closing
        
        instance.save()
        
        return instance
            
        
        
class ResetPettyCashSerializer(serializers.ModelSerializer):
    '''
        Model: PettyCash
        Urls : 
            1- URL : reset/
    '''
    class Meta:
        model = PettyCash
        fields = '__all__'
        
    lookup_field = 'id'
    
    def update(self, instance, validated_data):
        instance.initial_balance = 0
        instance.opening_amount = 0
        instance.incoming_amount = 0
        instance.outgoing_amount = 0
        instance.closing_balance = 0
        
        instance.save()
        
        return instance
