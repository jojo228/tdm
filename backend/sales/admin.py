from django.contrib import admin

# Register your models here.
from .models import (TableOrder, 
HotelTableStatus, ItemOrdered,TakeAway,
Bill, PaymentCategory, ItemCategory, Product,
ItemVariantAddOn, VariantDetails, AddOnDetails,
TaxGroup, Customers)

admin.site.register(TableOrder)
admin.site.register(HotelTableStatus)
admin.site.register(ItemOrdered)
admin.site.register(Bill)
admin.site.register(PaymentCategory)
admin.site.register(ItemCategory)
admin.site.register(Product)
admin.site.register(ItemVariantAddOn)
admin.site.register(VariantDetails)
admin.site.register(AddOnDetails)
admin.site.register(TaxGroup)
admin.site.register(Customers)
admin.site.register(TakeAway)
