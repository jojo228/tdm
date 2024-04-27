from django.db import models
from sales.models import Product, VariantDetails
from hotel.models import HotelData, HotelUser
from profiles.models import UserProfile
from django.contrib.auth import get_user_model
User=get_user_model()


# ----------------------------------------------------------------------------------------#
#                               Kitchen items request model                               #
#-----------------------------------------------------------------------------------------#

class KitchenItemRequests(models.Model):
    
    STATUS = (
        ('sent', 'Sent'),
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
    notification = models.ForeignKey(
        'Notification', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    type = models.CharField(max_length=50, default='request')
    status = models.CharField(max_length=50, choices=STATUS, default='sent')
    request = models.CharField(max_length=2000, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    ready_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']


class InventoryProduct(models.Model):
    OPTIONS = (
            ('created', 'Product Initially created'),
            ('sales', 'Product Sold'),
            ('dispose', 'Product Expired'),
            ('date changed', 'Product expiry date changed'),
            ('rework_decr', 'Rework from store to the kitchen'),
            ('rework_incr', 'Rework done... from kitchen back to store'),
            ('refill', 'Product Refillment'),
            ('change', 'Product Updated in Expense tracking')
        )
    hotel = models.ForeignKey(
        HotelData,
        on_delete=models.CASCADE,
    )
    
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    product_id = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE,
        null=False
    )
    
    variant = models.ForeignKey(
        VariantDetails,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    
    action = models.CharField(max_length=100, choices=OPTIONS, default=None)
    quantity = models.IntegerField(default=0)
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('hotel', 'product_id', 'variant')
        ordering = ['-created_at']

class InventoryProductAudit(models.Model):
    
    

    hotel = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE
    )
    
    action_by = models.CharField(max_length=50, null=True, blank=True)
    # updated_by = models.CharField(max_length=50, null=True, blank=True)
    # deleted_by = models.CharField(max_length=50, null=True, blank=True)

    inventory_product = models.ForeignKey(
        InventoryProduct, 
        on_delete=models.SET_NULL, 
        null=True
    )
    
    action = models.CharField(max_length=10) # create, update, delete
    description = models.CharField(max_length=100, default=None)
    old_data = models.JSONField(null=True, blank=True)
    new_data = models.JSONField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
# ----------------------------------------------------------------------------------------#
#                                     Notification model                                  #
#-----------------------------------------------------------------------------------------#

class Notification(models.Model):
    STATUS = (
        ('sent', 'Sent'),
        ('in progress', 'In Progress'),
        ('resolved', 'Resolved')
    )
    
    TYPE = (
        ('expiry', 'Expiry'),
        ('request', 'Request')
    )
    hotel = models.ForeignKey(
        HotelData, 
        on_delete=models.CASCADE,
        null=True, blank=True
    )
    product = models.ForeignKey(
        InventoryProduct,
        on_delete = models.CASCADE,
        null=True,
        blank=True
    )
    quantity = models.IntegerField(default=0)
    uom = models.CharField(max_length=50, null=True, blank=True)
    request = models.CharField(max_length=2000, null=True, blank=True)
    type = models.CharField(max_length=50, choices=TYPE, null=True)
    status = models.CharField(max_length=50, choices=STATUS)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    in_progress_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)