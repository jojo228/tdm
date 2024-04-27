from django.urls import path
from . import views

urlpatterns = [
    path('hotels/', views.hotel_list_view, name='hotels'),
    path('create_hotel/', views.hotel_create_view, name='create-hotel'),
    path('hotel_info/<int:pk>/', views.hotel_detail_view, name='hotel-info'),
    path('hotel_update/<int:pk>/', views.hotel_update, name='hotel-update'),
    path('hotel/', views.hotel_owner_account, name='hotel-owner'),
    path('hotel/onwer/update_account/<int:pk>/', views.owner_account_update, name='owner-update'),
    path('hotel_employee/create/', views.hotel_employee, name='create-hotel-employee'),
    
    # Get outets for a given hotel  : hotel_outlets/?hotel=1
    path('hotel_outlets/', views.hotel_outlets_list_view, name='hotel-outlets'),
    
     # Add and Get roles of each hotel
    
    path('roles/', views.get_roles, name='roles'),
    path('hotel_roles/', views.hotel_role, name='hotel-employee-roles'),
    path('dashboard/', views.dashboard, name="dashboard"),
    
    # Day dashboard for outlets
    path('dashboard_outlets/', views.dashboard_outlets, name='dashboard-outlets'),
    

    
    # Get the pettycash history
    path('get_pettycash_history/', views.get_pettycash_history, name='get-petty-cash-history'),
    # Update the pettycash
    path('update_pettycash/<int:pk>/', views.update_pettycash, name='update-petty-cash'),
    # Update the pettycash
    path('reset_pettycash/<int:pk>/', views.reset_pettycash, name='update-petty-cash'),
]
