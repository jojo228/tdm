from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from hotel.models import HotelData
from rest_framework.response import Response

from .models import InventoryProduct, InventoryProductAudit, Notification, KitchenItemRequests
from .serializers import (InventoryProductSerializer, InventoryAuditProductSerializer, 
                          NotificationSerializer,UpdateNotificationSerializer,
                          KitchenRequestsSerializer)

class ProductInventoryListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InventoryProductSerializer
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = InventoryProduct.objects.filter(hotel=hotel).select_related('user', 'variant', 'product_id')
            return queryset
        
inventory = ProductInventoryListCreateView.as_view()

class ProductInventoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InventoryProductSerializer
    queryset = InventoryProduct.objects.all()
        
retrieve_update_delete_inventory = ProductInventoryRetrieveUpdateDestroyAPIView.as_view()



class ProductInventoryAuditListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InventoryAuditProductSerializer
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        product = self.request.query_params.get('product')
        if hotel:
            if product:
                queryset = InventoryProductAudit.objects.filter(hotel=hotel, inventory_product=product)
            else:
                queryset = InventoryProductAudit.objects.filter(hotel=hotel)
            return queryset
        
        
    # def get(self):
    #     serializer = self.
inventory_audit = ProductInventoryAuditListView.as_view()


# For a single product of a particular hotel
class SingleProductInventoryAuditListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InventoryAuditProductSerializer
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        product = self.request.query_params.get('product')
        if hotel:
            queryset = InventoryProductAudit.objects.filter(hotel=hotel, inventory_product=product)
            return queryset
        
single_inventory_audit = SingleProductInventoryAuditListView.as_view()


class NotificationListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    #-----------------------------------------------------------------------------#
    #              Override the queryset to fetch based on the hotel              #
    #-----------------------------------------------------------------------------#
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = Notification.objects.filter(hotel=hotel).order_by('-created_at')
            return queryset

    #-----------------------------------------------------------------------------#
    #              Override the create method to insert multiple                  #
    #-----------------------------------------------------------------------------#
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
    
notification = NotificationListCreateAPIView.as_view()


class OutletsNotificationListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    def get(self,request, *args, **kwargs):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            outlets_requests = {}
            parent = HotelData.objects.get(hotel_id=hotel)
            outlets = parent.hoteldata_set.all()
            for outlet in outlets:
                notifications = Notification.objects.filter(hotel=outlet.hotel_id)
                outlet_notification = []
                if len(notifications) > 0:
                    print(type(notifications.values('id', 'hotel', 'product', 'request', 'status', 'created_at').order_by('-created_at')))
                    print(list(notifications.values('id', 'hotel', 'product', 'request', 'status', 'created_at').order_by('-created_at')))
                    notifications = list(notifications.values('id', 'hotel', 'product','quantity', 'uom', 'type', 'request', 'status', 'created_at').order_by('-created_at'))
                    for ele in notifications:
                        if ele['product'] == None:
                            ele['product_details'] = None
                        else:
                            product = InventoryProduct.objects.get(id=ele['product'])
                            variant = product.variant
                            if variant == None:
                                ele['product_details'] = {
                                    'name' : product.product_id.name
                                    }
                            else:
                                ele['product_details'] = {
                                    'name' : product.product_id.name,
                                    'variant' : variant.variant_value
                                }
                        print(ele)
                            
                    outlet_notification.append(notifications)
                outlets_requests[outlet.hotel_name] = outlet_notification 
            return Response(outlets_requests)
    
notifications = OutletsNotificationListCreateAPIView.as_view()


class NotificationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateNotificationSerializer
    queryset = Notification.objects.all()
        
retrieve_update_delete_notification = NotificationRetrieveUpdateDestroyAPIView.as_view()



class KitchenRequestsListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = KitchenRequestsSerializer
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel', None)
        if hotel:
            return KitchenItemRequests.objects.filter(hotel_id=hotel).order_by('-created_at')
        
kitchen_requests = KitchenRequestsListCreateAPIView.as_view()

        
class KitchenRequestsRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = KitchenRequestsSerializer
    queryset = KitchenItemRequests.objects.all()
        
retrieve_update_delete_kitcken_request = KitchenRequestsRetrieveUpdateDestroyAPIView.as_view()