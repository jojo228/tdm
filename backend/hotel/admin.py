from django.contrib import admin

# Register your models here.
from .models import (HotelData, HotelAttributes,
                     HotelUser, Role, PettyCash)

admin.site.register(HotelData)
admin.site.register(HotelAttributes)
admin.site.register(HotelUser)
admin.site.register(Role)
admin.site.register(PettyCash)
