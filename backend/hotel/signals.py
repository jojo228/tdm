from django.db.models.signals import post_save
from django.dispatch import receiver
from . models import HotelData, HotelUser, Role
from profiles.models import UserProfile
from services.models import KitchenServices

def create_hotel_user(sender, instance, created, *args, **kwargs):
    if created:
        print("INSTANCE", instance)
        role = Role.objects.create(hotel_id=instance, role_name="owner")
        mobile = UserProfile.objects.get(user=instance.owner).mobile_number
        HotelUser.objects.create(hotel_id=instance, role_id = role, user=instance.owner, mobile_number=mobile)
        
        # Automatically disable the kitchen service
        KitchenServices.objects.create(hotel = instance)
        
post_save.connect(create_hotel_user, sender=HotelData)