from django.urls import path
from . import views

#----------------------------------------------------------------------------------------------------------#
#                                     sales collection urls                                                #
#----------------------------------------------------------------------------------------------------------#
urlpatterns = [
    # Get all the Products/Items
    path('items/', views.items_list_create_view, name='item-list'),
    
    # Adding new Item/Product
    path('add_item/', views.item_create_view, name='add-item'), 
    
    # Get a detail of a particalar item/product
    path('items/<int:pk>/', views.item_detail_view, name='item-detail'),
    
    # Update/Edit a given Item/Product
    path('items/update/<int:pk>/', views.item_update_view, name='item-edit'),
    
    # Delete a given Item/Product
    path('items/delete/<int:pk>/', views.item_delete_view),
    
    # Get All the Items/Products related to a given category 
    path('item_category/', views.item_detail_by_category_view, name='item-detail-category'),
    
    # Get the different item/product category that a given hotel has
    path('hotel/item_category/', views.items_category, name='hotel-item-category'),
    
    # Get all the different variants of hotel
    path('items/variants/', views.get_variants, name='get-variants'),
    
    # Get the Variant add on details
    path('items/variants/add_on/', views.add_on_variants, name='get-variant-add-on'),
    
    # Update item Variant add on details
    path('items/variants/add_on/<int:pk>/', views.add_on_variants_update, name='get-variant-add-on-update'),
    
    # Get all the add on values
    path('items/add_on/', views.add_on_details, name='get-add-on'),
    
    # Get all the add ons attached to a given product : product/variants/addons/?hotel=1&product=1
    path('product/variants/addons/', views.product_variants_addons, name='product-addons'),

    # Create or Get list of customers we have for a given hotel
    path('customers/', views.customer_create_list_view, name='customer-list'),
   
    # Get a customer details searched by its mobile number
    path('customer/', views.customer_detail_view, name='customer-detail'),

    # For all the Hotels
    path('all_receipts/', views.get_all_receipt, name='create-receipt'), 
    
    # Get the receipt of a given bill of particular hotel
    path('receipts/print/<str:pk>/', views.receipt, name='print-receipt'), 
    
    # retrieve receipt information given bill id and hotel id : in Web browser --> receipt/1/?bill=1
    path('receipt/<int:pk>/', views.hotel_bill, name='hotel-bill-info'), 
    
    # All the receipts for a given Hotel : It must look like : receipts/?hotel=1
    path('receipts/', views.receipts, name='receipts'), 
    
    # Place an order ---> It refered to Item ordered
    path('order_ticket/', views.order_ticket, name='order-ticket'),
    
    # Get all orders for a given hotel
    path('orders/', views.orders, name='orders'),
    
    path('table_orders/<int:pk>/', views.hotel_table_occ_orders, name='occupied-table-orders'),
    
    path('takeaway_orders/<int:pk>/', views.hotel_takeaway_orders, name='occupied-table-orders'),
    
    # Get the table status
    path('table_status/', views.table_status, name='table-status'),
    
    # Create table status for a customer
    path('create_table/', views.table_status, name='create-table'),
    
    # Update the table status
    path('table_update/<int:pk>/', views.table_update, name='table-update'),
    
    # Get all the Tax groups
    path('tax_groups/', views.tax_groups, name='tax-groups'),
    
    # Add Tax group to the given hotel
    path('add_tax/', views.tax_groups, name='add-tax'),
    
    # Update the tax group of a particular hotel
    path('tax_update/<int:pk>/', views.tax_update, name='tax-update'),
    
    # Get all payment types
    path('get_payment_types/', views.payment_types, name='get-payment-types'),
    
    # Add payment type
    path('add_payment_type/', views.payment_types, name='add_payment-type'),
    
    # Update or delete Item category for a given hotel
    path('update_delete_item_category/<int:pk>/', views.update_item_category, name='update-delete-item-category'),
    
    # Delete tax group for a given hotel
    path('delete_tax_group/<int:pk>/', views.delete_tax_group, name='delete-tax-group'),
    
    # Update or Delete addon for a given hotel
    path('update_delete_addon/<int:pk>/', views.update_delete_addon, name='update_delete-addon'),
    
    # Update or Delete variant for a given hotel
    path('update_delete_variant/<int:pk>/', views.update_delete_variant, name='update_delete-variant'),
    
    # Update or Delete payment category/type for a given hotel
    path('update_delete_payment/<int:pk>/', views.update_delete_payment, name='update_delete-payment'), 
    
    # Upload file to create bulk of products
    path('upload_products/', views.upload_products, name='upload-products'),
    
    # Download all products or specific categories products
    path('download_products/', views.download_products, name='download-products'),
    
    # Kitchen orders
    path('kitchen_orders/', views.kitchen_orders, name='kitchen-orders'),
    
    # Kitchen order retrieve, update or delete
    path('kitchen_orders/<int:pk>/', views.kitchen_order_retrieve_update_delete, name='kitchen-orders'),
    
    # Kitchen takeaways
    path('kitchen_takeaways/', views.kitchen_takeaways, name='kitchen-takeaways'),
    
    # Sell takeaways
    path('sell_takeaways/', views.sell_takeaways, name='sell-takeaways'),

    # Kitchen takeaway retrieve, update or delete
    path('kitchen_takeaway/<int:pk>/', views.kitchen_takeaway_retrieve_update_delete, name='kitchen-takeaways'),
    
    # Item in kitchen order retrieve, update or delete
    path('kitchen_item_ordered/<int:pk>/', views.ordered_item_retrieve_update_delete, name='kitchen-item-ordered'),
]