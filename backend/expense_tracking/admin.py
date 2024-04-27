from django.contrib import admin

from expense_tracking.models import (
    PurchaseProducts, ResellingProducts, Salary, Rent, Ebill
)

admin.site.register(PurchaseProducts)
admin.site.register(ResellingProducts)
admin.site.register(Salary)
admin.site.register(Rent)
admin.site.register(Ebill)