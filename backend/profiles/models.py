from django.db import models
import uuid
from django.contrib.auth import get_user_model
User=get_user_model()

########################################################## PROFILES START #############################################################

  
# ----------------------------------------------------------------------------------------#
#                                     Customer model                                      #
#-----------------------------------------------------------------------------------------#
class UserProfile(models.Model):
    
    ACTIVE_TYPE = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        null=True,
        blank=True, 
        related_name='profiles'
    )
    
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=500, blank=True, null=True)
    username = models.CharField(max_length=200, blank=True, null=True)
    password = models.CharField(default=0, max_length=2000, blank=False, null=False)
    mobile_number = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=50, choices=ACTIVE_TYPE)
    tokens = models.CharField(max_length=200, null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(auto_now_add=True)
    
    profile_id = models.UUIDField(
        default=uuid.uuid4, 
        primary_key=True, 
        editable=False
    )
    
    class Meta:
        ordering = ['-created_at', '-username']
    
    def __str__(self):
        return self.username
    
    def __unicode__(self):
        return self.name


########################################################## PROFILES END ###############################################################