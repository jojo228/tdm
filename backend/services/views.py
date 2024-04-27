from django.shortcuts import render
from .models import KitchenServices
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import KitchenServiceSerializer

class KitchenServicesListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = KitchenServiceSerializer
    permission_classes = [IsAuthenticated]
    queryset = KitchenServices.objects.all()
    
    
kitchen_service = KitchenServicesListCreateAPIView.as_view()
    
class KitchenServicesRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = KitchenServiceSerializer
    permission_classes = [IsAuthenticated]
    queryset = KitchenServices.objects.all()
    
retrieve_update_delete_kitchen_service = KitchenServicesRetrieveUpdateDestroy.as_view()
