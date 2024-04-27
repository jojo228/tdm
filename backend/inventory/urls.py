from django.urls import path, include
from . import views

urlpatterns = [
    # Get and Create Inventory
    path('inventory/', views.inventory, name='product-inventory'),
    
    # Retrieve, Update or Delete a single product
    path('inventory/<int:pk>/', views.retrieve_update_delete_inventory, name='rud_inventory'),
    
    # Audit the inventory table
    path('inventory_audit/', views.inventory_audit, name='inventory-audit'),
    
    # Retrieve single product audit
    path('inventory_audit/<int:pk>', views.inventory_audit, name='inventory-audit'),
        
    # Hotel Notification
    path('notification/', views.notification, name='notification'),
    
    # Hotel Notification
    path('notifications/', views.notifications, name='notification'),
    
    # Hotel Notification
    path('update_notification/<int:pk>/', views.retrieve_update_delete_notification, name='rud-notification'),
    
    # Kitchen Requests
    path('kitchen_requests/', views.kitchen_requests, name='kitchen-requests'),
    
    # Hotel Notification
    path('kitchen_request/<int:pk>/', views.retrieve_update_delete_kitcken_request, name='rud-kitchen-request'),

    
]