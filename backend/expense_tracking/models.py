from django.db import models
from hotel.models import HotelUser, HotelData
from sales.models import PaymentCategory, Product, VariantDetails


# ----------------------------------------------------------------------------------------#
#                                        UOM model                                        #
#-----------------------------------------------------------------------------------------#
class Uom(models.Model):
    TYPES = (
        ('L', 'Litre'), 
        ('ml', 'Millilitres'),
        ('g', 'Grams'),
        ('mg', 'Milligrams'),
        ('kg', 'Kilograms'),
        ('pack', 'Packs of Unit')
    )
    hotel = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE
    )
    
    measurement = models.CharField(max_length=50, choices=TYPES)
    

# ----------------------------------------------------------------------------------------#
#                                   PurchaseProducts model                                #
#-----------------------------------------------------------------------------------------#

class PurchaseProducts(models.Model):
    hotel = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    payment_type = models.ForeignKey(
        PaymentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=False
    )

    uom = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    unit_price = models.BigIntegerField(default=0)
    total_price = models.BigIntegerField(default=0)
    vendor_name = models.CharField(max_length=100)
    extracharges = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('hotel', 'name', 'vendor_name')
        ordering = ['-created_at']
        

# ----------------------------------------------------------------------------------------#
#                                   ResellingProducts model                               #
#-----------------------------------------------------------------------------------------#

class ResellingProducts(models.Model):
    hotel = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    payment_type = models.ForeignKey(
        PaymentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=False
    )

    uom = models.CharField(max_length=50)
    quantity = models.IntegerField(default=0)
    unit_price = models.BigIntegerField(default=0)
    total_price = models.BigIntegerField(default=0)
    vendor_name = models.CharField(max_length=100)
    profit = models.BigIntegerField(default=0)
    related_to_product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    variant = models.ForeignKey(
        VariantDetails,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    extracharges = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return (self.related_to_product.name + " " + self.variant.variant_value) 

    class Meta:
        unique_together = ('hotel', 'related_to_product', 'vendor_name', 'variant')
        ordering = ['-created_at']

# ----------------------------------------------------------------------------------------#
#                                      Salary model                                       #
#-----------------------------------------------------------------------------------------#
        
class Salary(models.Model):
    hotel = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    employee = models.ForeignKey(
        HotelUser, 
        on_delete=models.SET_NULL,
        null=True,
        blank=False
    )
    
    payment_type = models.ForeignKey(
        PaymentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=False
    )
    
    salary = models.IntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)


      

# ----------------------------------------------------------------------------------------#
#                                      Rent model                                         #
#-----------------------------------------------------------------------------------------#     
class Rent(models.Model):
    hotel = models.ForeignKey(
        HotelData,
        on_delete= models.CASCADE,
        null=False,
        blank=False)
    
    
    payment_type = models.ForeignKey(
        PaymentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=False
    )
    month = models.CharField(max_length=100)
    price = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


# ----------------------------------------------------------------------------------------#
#                                       Ebill model                                       #
#-----------------------------------------------------------------------------------------#     
class Ebill(models.Model):
    hotel = models.ForeignKey(
        HotelData,
        on_delete= models.CASCADE,
        null=False,
        blank=False)
    
    month = models.CharField(max_length=100)
    price = models.IntegerField()
    
    payment_type = models.ForeignKey(
        PaymentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
