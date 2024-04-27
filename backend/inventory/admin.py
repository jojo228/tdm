from django.contrib import admin

# Register your models here.

from .models import InventoryProduct, InventoryProductAudit, Notification, KitchenItemRequests
admin.site.register(InventoryProduct)
admin.site.register(InventoryProductAudit)
admin.site.register(Notification)
admin.site.register(KitchenItemRequests)
