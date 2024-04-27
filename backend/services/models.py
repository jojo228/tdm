from django.db import models
from hotel.models import HotelData

class KitchenServices(models.Model):
    hotel = models.OneToOneField(
        HotelData,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    