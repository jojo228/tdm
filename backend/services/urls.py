from django.urls import path
from . import views

urlpatterns = [
    path('kitchen_service/', views.kitchen_service, name='kitchen-service'),
    path('kitchen_service/<int:pk>/', views.retrieve_update_delete_kitchen_service, name='kithen-service-rud'),
]
