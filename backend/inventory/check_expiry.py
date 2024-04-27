from .models import InventoryProduct
from datetime import datetime
from .models import Notification

def expiry_checker():
    inventories = InventoryProduct.objects.all()
    for product in inventories:
        # Check if a product has an expiry date or not
        expiry_date = product.expiry_date
        if expiry_date:
            # Check if the expiry date is today or not
            if expiry_date == datetime.today().date():
                # Then send a notification
                Notification.objects.create(
                    hotel = product.hotel,
                    product = product,
                    request = 'Product is expirying today!',
                    status = 'sent',
                    type = 'expiry'
                )
                
                product.action = 'dispose'
                product.save()
                

                
            
            