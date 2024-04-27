from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from .models import InventoryProduct, InventoryProductAudit
import datetime
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize

    # OPTIONS = (
    #         ('sales', 'Product Sold'),
    #         ('dispose', 'Product Expired'),
    #         ('rework_decr', 'Rework from store to the kitchen'),
    #         ('rework_incr', 'Rework done... from kitchen back to store'),
    #         ('refill', 'Product Refillment')

# Converting the datetime in to appropriate format.
def dateconverter(date):
    return date.strftime("%Y-%m-%d %H:%M:%S")

# Catching previous instance before updating
@receiver(pre_save, sender=InventoryProduct)
def send_old_inventory_product(sender, instance, *args, **kwargs):
    if instance.id:
        instance.old = instance.__class__.objects.get(id=instance.id)

# Creating Audit table after each action
@receiver(post_save, sender=InventoryProduct)
def audit_inventory_product_create_update(sender, instance, created, **kwargs):
    hotel = instance.hotel
    action = 'create' if created else 'update'
    old_data = None if created else instance.old            
    new_data = dict(json.loads(serialize('json', [instance], cls=DjangoJSONEncoder))[0])
    new_data = new_data['fields']
    
    if old_data == None:
        InventoryProductAudit.objects.create(
            inventory_product=instance,
            hotel=hotel,
            action=action,
            description = instance.get_action_display(),
            old_data= None,
            new_data=new_data,
            action_by = instance.user.username + " : " + instance.user.email
        )
    else:
        old_data = dict(json.loads(serialize('json', [old_data], cls=DjangoJSONEncoder))[0])
        old_data = old_data['fields']
        InventoryProductAudit.objects.create(
            inventory_product=instance,
            hotel=hotel,
            action=action,
            description = instance.get_action_display(),
            old_data= old_data,
            new_data=new_data,
            action_by = instance.user.username + " : " + instance.user.email
        )

@receiver(post_delete, sender=InventoryProduct)
def audit_inventory_product_delete(sender, instance, **kwargs):
    old_data = dict(json.loads(serialize('json', [instance], cls=DjangoJSONEncoder))[0])['fields']
    InventoryProductAudit.objects.create(
        hotel=instance.hotel,
        action='delete',
        old_data=old_data,
        new_data=None,
        description = "Product deleted",
        action_by = instance.user.username + " : " + instance.user.email,
        deleted_at = datetime.datetime.today()
    )

