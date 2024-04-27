from django.db import models
from hotel.models import HotelData
import uuid


########################################################## SALES START ################################################################

# ----------------------------------------------------------------------------------------#
#                                     TakeAway model                                     #
#-----------------------------------------------------------------------------------------#

class TakeAway(models.Model):
    STATUS = (
        ('created', 'Created'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered')
    )
    
    hotel_id = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=True, 
        blank=True
    )
    
    customer = models.ForeignKey(
        'Customers',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    order_id = models.ManyToManyField(
        'ItemOrdered',
        blank=True
    )
    
    order_status = models.CharField(max_length=50, choices=STATUS, null=True)
    
    bill_id = models.ForeignKey(
        'Bill',
        on_delete=models.CASCADE,
        null=True,
        blank=True
        
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    ready_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    
# ----------------------------------------------------------------------------------------#
#                                     TableOrder model                                    #
#-----------------------------------------------------------------------------------------#

class TableOrder(models.Model):
    STATUS = (
        ('created', 'Created'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered')
    )
    
    hotel_id = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=True, 
        blank=True
    )
    
    table_id = models.ForeignKey(
        'HotelTableStatus',
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    
    
    #-------------------------------I will add this later to the code----------------------------#
    
    order_id = models.ManyToManyField(
        'ItemOrdered',
        blank=True
    )
    
    order_status = models.CharField(max_length=50, choices=STATUS, null=True)
    
    bill_id = models.ForeignKey(
        'Bill',
        on_delete=models.CASCADE,
        null=True,
        blank=True
        
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    ready_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    # def __str__(self):
    #     return self.order_id
    
    # class Meta:
    #     unique_together = ('hotel_id', 'table_id', 'order_id')
    

# ----------------------------------------------------------------------------------------#
#                                 HotelTableStatus model                                  #
#-----------------------------------------------------------------------------------------#

class HotelTableStatus(models.Model):
    TYPE = (
        ('occupied', 'Occupied'),
        ('free', 'Free'),
    )
    
    hotel_id = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE
    )
    
    customer_id = models.ForeignKey(
        'Customers', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    table_id = models.AutoField(primary_key=True, null=False, editable=False, unique=True)
    
    status = models.CharField(max_length=100, choices=TYPE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    number = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        if self.customer_id:
            return "Table " + str(self.table_id) + " is " + self.status + " by " + str(self.customer_id.customer_name)
        else:
            return "Table " + str(self.table_id) + " is " + self.status
    

    ordering=['-created_at']

# ----------------------------------------------------------------------------------------#
#                                         Bill model                                      #
#-----------------------------------------------------------------------------------------#

class Bill(models.Model):
    TYPE = (
        ('percent','Percent'),
        ('amount','Amount'),
    )
    
    STATUS = (
        ('paid','Paid'),
        ('unpaid','Unpaid'),
    )
    
    hotel_id = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE,
        null=False,
        blank = True
    )
    
    bill_id = models.AutoField(primary_key=True, unique=True, editable=False)
    bill_status = models.CharField(max_length=200, choices=STATUS)
    refund_amount = models.PositiveIntegerField(null=True, blank=True, default=0)
    cash_recieved = models.PositiveIntegerField(null=True, blank=True, default=0)    
    discount_type = models.CharField(max_length=100, null=True, blank=True, choices=TYPE)
    discount_value = models.FloatField(null=True, blank=True, default=0)
    total_amount = models.FloatField(default=0, null=True, blank=True)
    round_off_amount = models.FloatField(default=0, null=True, blank=True)
    discount_amount =  models.FloatField(default=0, null=True, blank=True)
    net_amount =  models.FloatField(default=0, null=True, blank=True)
    cash_balance =  models.FloatField(default=0, null=True, blank=True)
    
    payment_type = models.ForeignKey(
        'PaymentCategory',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    customer = models.ForeignKey(
        'Customers',
        null = True,
        on_delete=models.SET_NULL,
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    
    class Meta:
        ordering = ['-created_at']

        indexes = [
            models.Index(fields=['hotel_id', 'created_at']),
            models.Index(fields=['hotel_id', 'bill_status', 'created_at'])
        ]
        
        
# ----------------------------------------------------------------------------------------#
#                                    Item Ordered model                                   #
#-----------------------------------------------------------------------------------------#

class ItemOrdered(models.Model):
    
    ORDER_TYPE = (
        ('table order', 'Talbe Order'),
        ('takeaway', 'TakeAway')
    )
    
    STATUS = (
        ('created', 'Created'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered')
    )
    
    hotel_id = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=False,
        blank = True
    )
    bill_id = models.ForeignKey(
        'Bill', 
        on_delete=models.CASCADE
    )
    products = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE
    )
    
    addon = models.ManyToManyField(
        'AddOnDetails',
        blank=True,
    )
    
    variant = models.ForeignKey(
        'VariantDetails',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    
    status = models.CharField(max_length=50, choices=STATUS, default='sent', null=True, blank=True)
    
    type = models.CharField(max_length=50, choices=ORDER_TYPE, default='table order', null=True, blank=True)
    
    quantity = models.PositiveIntegerField(default=1)

    item_remarks = models.CharField(max_length=100, blank=True, null=True)
     
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    ready_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['hotel_id', 'created_at']),
            models.Index(fields=['hotel_id', 'status', 'created_at'])
        ]
    
    
# ----------------------------------------------------------------------------------------#
#                                    Item Category model                                  #
#-----------------------------------------------------------------------------------------#

class ItemCategory(models.Model):
    hotel_id = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=True, 
        blank=True
    )
    
    item_category_id = models.AutoField(primary_key=True, unique=True, editable=False)
    item_category_name = models.CharField(max_length=100, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('hotel_id', 'item_category_id', 'item_category_name')
        
    def __str__(self):
        return self.item_category_name
    
    def __unicode__(self):
        return self.name    
    
    
# ----------------------------------------------------------------------------------------#
#                                    Products model                                       #
#-----------------------------------------------------------------------------------------#

class Product(models.Model):
    hotel_id = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE, 
        null=True,
        blank=True, 
        related_name='hotel'
    )

    name = models.CharField(max_length=100, blank=True, null=False)
    unit_price = models.PositiveBigIntegerField(null=True, blank=True, default=0)
    net_price = models.PositiveBigIntegerField(null=True, blank=True)
    item_category_id = models.ForeignKey(
        'ItemCategory', 
        on_delete=models.CASCADE
    )

    
    tax_group_id = models.ForeignKey(
        'TaxGroup', 
        on_delete=models.CASCADE,
        related_name='tax'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('hotel_id', 'id')
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name
    
    def __unicode__(self):
        return self.name
    

# ----------------------------------------------------------------------------------------#
#                                   Item Variant AddOn model                              #
#-----------------------------------------------------------------------------------------#

class ItemVariantAddOn(models.Model):
    hotel = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE,
        null=True
    )
    item_id = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    
    variant = models.ManyToManyField(
        'VariantDetails',
        blank=True,
        default=[]
    )
    
    item_add_on = models.ManyToManyField(
        'AddOnDetails', 
        blank=True,
        default=[]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)


# ----------------------------------------------------------------------------------------#
#                                  Variant Detail model                                   #
#-----------------------------------------------------------------------------------------#
 
class VariantDetails(models.Model):
    hotel = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE,
        null=True
    )
    
    variant_id = models.AutoField(primary_key=True, unique=True, editable=False)
    variant_value = models.CharField(max_length=100, blank=False, null=False)
    price = models.PositiveBigIntegerField(null=False, blank=False)
    variant_desc = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.variant_value
    class Meta:
        unique_together = ('hotel', 'variant_id')
        ordering = ['-created_at']


# ----------------------------------------------------------------------------------------#
#                                       AddOn model                                       #
#-----------------------------------------------------------------------------------------#

class AddOnDetails(models.Model):
    hotel = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE,
        null=True
    )
    
    add_on_id = models.AutoField(primary_key=True, unique=True, editable=False)
    add_on_value = models.CharField(max_length=100, blank=False, null=False)
    price = models.PositiveBigIntegerField(null=False, blank=False)
    add_on_desc = models.CharField(max_length=100, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.add_on_value
    
    class Meta:
        unique_together = ('hotel', 'add_on_id')
        ordering = ['-created_at']
    
    
# ----------------------------------------------------------------------------------------#
#                                       TaxGroup model                                    #
#-----------------------------------------------------------------------------------------#

class TaxGroup(models.Model):
    hotel_id = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE, 
        null=True
    )
    
    tax_group_id = models.AutoField(primary_key=True, unique=True, editable=False)
    tax_group_name = models.CharField(max_length=100, null=False)
    tax_value = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.tax_group_name

    class Meta:
        ordering = ['-created_at']
    
    
# ----------------------------------------------------------------------------------------#
#                                  Payment Category model                                 #
#-----------------------------------------------------------------------------------------#
    
class PaymentCategory(models.Model):
    TYPE = (
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('others', 'Others')
    )
    
    hotel = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE,
        null=True
    )
    payment_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=100, choices=TYPE, default='others')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.get_name_display()
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['hotel', 'name']
        
        
# ----------------------------------------------------------------------------------------#
#                                     Customer model                                      #
#-----------------------------------------------------------------------------------------#

class Customers(models.Model):
    hotel_id = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
        null=True
    )
    
    customer_id = models.AutoField(primary_key=True, unique=True, editable=False)
    customer_name = models.CharField(max_length=100, null=False)
    customer_mobile = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.customer_name
    
    class Meta:
        unique_together = ('hotel_id', 'customer_id', 'customer_mobile')
        ordering = ['-created_at']

        indexes = [
            models.Index(fields=['hotel_id', 'created_at'])
        ]


########################################################## SALES END ##################################################################
