from django.db.models.signals import post_save

from inventory.models import InventoryProduct

from .models import Bill, ItemOrdered, Product

# def bill_update(sender, instance, created, *args, **kwargs):
#     if created:
#         bill_id = instance.bill_id
#         products = []
#         orders = ItemOrdered.objects.filter(bill_id = bill_id)
#         print("ORDERS", orders)
#         if len(orders) > 0:
#             total_amount = 0
#             for order in orders:
#                 print("ORDER:", Product.objects.filter(id=order.products.id))
#                 product = dict(*Product.objects.filter(id=order.products.id)
#                                         .values('id', 'hotel_id_id', 'name', 
#                                                 'unit_price', 'net_price',
#                                                 'item_category_id', 'tax_group_id'))
#                 product['quantity'] = order.quantity
#                 products.append(product)
                
#                 total_amount += sum([product['net_price'] * product['quantity']])


#             discount_type = bill_id.discount_type
            
#             discount_value = bill_id.discount_value
            
#             refund_amount = bill_id.refund_amount
            
#             cash_recieved = bill_id.cash_recieved
            
#             round_off_amount = math.floor(total_amount)
            
#             Bill.objects.filter(bill_id=bill_id.bill_id).update(
#                 total_amount=total_amount,
#                 round_off_amount = round_off_amount,
#                 discount_amount = discount_amount(
#                     discount_type, 
#                     round_off_amount, 
#                     discount_value
#                 ),
                
#                 net_amount = net_amount(
#                     round_off_amount,
#                     discount_amount(
#                             discount_type, 
#                             round_off_amount,
#                             discount_value
#                         ), 
#                         refund_amount
#                     ),
                
#                 cash_balance = cash_balance(
#                     cash_recieved, 
#                     net_amount(
#                         round_off_amount,
#                         discount_amount(
#                             discount_type, 
#                             round_off_amount,
#                             discount_value
#                         ), 
#                         refund_amount
#                     )
#                 )
#             )   
            
# post_save.connect(bill_update, sender=ItemOrdered)
            
        
# def discount_amount(discount_type, round_off_amount, discount_value):
#     if discount_type == 'percent':
#         return (round_off_amount) * float(discount_value)/100.0
    
#     elif discount_type == 'amount':
#         return discount_value
#     else: 
#         return 0

     

# def net_amount(round_off_amount, discount_amount, refund_amount):
#     if refund_amount == 0 and discount_amount == 0:
#         return round_off_amount
#     elif discount_amount != 0 and refund_amount == 0:
#         return (round_off_amount - discount_amount)
#     elif discount_amount == 0 and refund_amount != 0:
#         return round_off_amount - refund_amount
#     elif discount_amount !=0  and refund_amount != 0:
#         return (round_off_amount - discount_amount - refund_amount)
#     else: 
#         return 0

        
# def cash_balance(cash_recieved, net_amount):
#     if cash_recieved != 0:
#         return (cash_recieved - net_amount)
#     else:
#         return 0
            
# Signal that trigger the Product Table by updating the product_net Price one the product is created.           
def product_update(sender, instance, created, *args, **kwargs):
    if created:
        print("INSTANCE", instance)
        print("UNIT PRICE", instance.unit_price)
        print('tax_value', instance.tax_group_id.tax_value)
        net_price = float(instance.unit_price) + (float(instance.unit_price) * float(instance.tax_group_id.tax_value))/100.0
        instance.net_price = net_price
        instance.save()
        
        
post_save.connect(product_update, sender=Product)
    

            
