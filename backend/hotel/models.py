from django.db import models
import uuid
from django.contrib.auth import get_user_model
User=get_user_model()


########################################################## HOTEL START ##################################################################


# ----------------------------------------------------------------------------------------#
#                                     Hotel Data model                                    #
#-----------------------------------------------------------------------------------------#

class HotelData(models.Model):
    
    ACTIVE_TYPE = (  
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )
    
    HOTEL_TYPE = (
        ('restaurant', 'Restaurant'),
        ('bakery', 'Bakery')
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        )
    hotel_name = models.CharField(max_length=100, null=False, blank=False, unique=True)
    location = models.CharField(max_length=100, null=False)
    address = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=100)
    hotel_type = models.CharField(max_length=50, choices=HOTEL_TYPE)
    web_site = models.CharField(max_length=2000, null=True, blank=True)
    facebook_link = models.CharField(max_length=2000, null=True, blank=True)
    instagram_link = models.CharField(max_length=2000, null=True, blank=True)
    status = models.CharField(max_length=50, choices=ACTIVE_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(auto_now_add=True)
    hotel_id = models.AutoField(primary_key=True, editable=False, unique=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True 
    )
    
    def __str__(self):
        return self.hotel_name
    

# ----------------------------------------------------------------------------------------#
#                                Hotel Attribute model                                    #
#-----------------------------------------------------------------------------------------#

class HotelAttributes(models.Model):
    hotel_id = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE
    )
    
    table_id = models.AutoField(primary_key=True, editable=False, unique=True)
    table_name = models.CharField(max_length=100, null=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('hotel_id', 'table_id')

    def __str__(self):
        return self.table_name
    
    def __unicode__(self):
        return self.name
    
    
        
# ----------------------------------------------------------------------------------------#
#                                      Hotel User model                                   #
#-----------------------------------------------------------------------------------------#

class HotelUser(models.Model):
    hotel_id = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE
    )
    
    role_id = models.ForeignKey(
        'Role',
        null=True, 
        on_delete=models.CASCADE
    )
    
    user = models.ForeignKey(
        User, 
        null=True, 
        on_delete=models.CASCADE
        
    )

    mobile_number = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
        
    def __str__(self):
        return self.user.username
    
    def __unicode__(self):
        return self.name
    
            
            
# ----------------------------------------------------------------------------------------#
#                                          Role model                                     #
#-----------------------------------------------------------------------------------------#

class Role(models.Model):
    hotel_id = models.ForeignKey(HotelData, on_delete=models.CASCADE)
    role_id = models.UUIDField(default=uuid.uuid4, primary_key=True,
                               unique=True, editable=False)
    role_name = models.CharField(max_length=100, null=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return self.role_name
    
    def __unicode__(self):
        return self.name


# ----------------------------------------------------------------------------------------#
#                                Petty Cash model                                         #
#-----------------------------------------------------------------------------------------#
class PettyCash(models.Model):
    hotel = models.ForeignKey(
        HotelData,
        on_delete= models.CASCADE,
        null=False,
        blank=False
    )
    date = models.DateTimeField(auto_now_add=True)
    initial_balance = models.IntegerField(default=0)
    opening_amount = models.IntegerField(default=0)
    incoming_amount = models.IntegerField(default=0)
    outgoing_amount = models.IntegerField(default=0)
    closing_balance = models.IntegerField(default=0)
    
########################################################## HOTEL END #################################################################