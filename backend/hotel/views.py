from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response


from datetime import date
from django.db.models import Sum, Count, Sum, F

# Importing serializers and models
from .serializers import (
    HotelsSerializer, HotelDetailSerializer, RolesSerializer,
    HotelUserSerializer, HotelUserRolesSerializer,
    HotelUserWithoutPasswordSerializer,HotelOutletsSerializer,
    HotelOwnerSerializer, PettyCashSerializer, ResetPettyCashSerializer
)

from .models import HotelData, Role, HotelUser, PettyCash
from sales.models import (
    Product, Customers, Bill, ItemOrdered, 
    ItemCategory, PaymentCategory, VariantDetails,
    ItemVariantAddOn, AddOnDetails
)
from collections import defaultdict

class HotelListView(generics.ListAPIView):
    """
        Definition: Get a list of all the hotels subscribe to our plateform
        Url: hotels/
    """
    permission_classes = [IsAuthenticated]
    queryset = HotelData.objects.all()
    serializer_class = HotelDetailSerializer
    
hotel_list_view = HotelListView.as_view()



class HotelOutletsListAPI(generics.ListAPIView):
    """
        Definition: Get a list of all the hotels subscribe to our plateform
        Url: hotel_outlets/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = HotelOutletsSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = HotelData.objects.filter(parent=hotel)
            return queryset
        else:
            return Response(status.HTTP_400_BAD_REQUEST)
    
hotel_outlets_list_view = HotelOutletsListAPI.as_view()

class HotelCreateView(generics.CreateAPIView):
    """
        Definition: Create a hotel
        Url: create_hotel/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = HotelsSerializer
    queryset = HotelData.objects.all()
    
hotel_create_view = HotelCreateView.as_view()

class HotelDetailAPIView(generics.RetrieveAPIView):
    """
        Definition: Retreive information about a specific hotel
        Url: hotel_info/<int:pk>/
    """
    permission_classes = [IsAuthenticated]
    queryset = HotelData.objects.all()
    serializer_class = HotelsSerializer
    
hotel_detail_view = HotelDetailAPIView.as_view()

           
# ----------------------------------------------------------------------------------------#
#                                Definition: Update a hotel detail                        #
#                                 Url : hotel_update/<int:pk>/                            #
#-----------------------------------------------------------------------------------------#
@api_view(['POST'])     
def hotel_update(request, pk):
    value = HotelData.objects.get(hotel_id=pk)
    serializer = HotelsSerializer(instance=value, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(status=value.HTTP_404_NOT_FOUND)
    
    
class HotelOwnerAccount(generics.ListAPIView):
    """
        Definition: Get the hotel owner account
        Urls: 
            1- hotel/?id=1$hotel=1
                - id should be the role id that correspond to owner
                - hotel should be the hotel id
            2- 
    """
    permission_classes = [IsAuthenticated]
    serializer_class = HotelOwnerSerializer
    
    def get_queryset(self):

        hotel = self.request.query_params.get('id')
        owner = self.request.query_params.get('user', '').lower()
        users = self.request.query_params.get('hotel')
        
        
        if users is None:
            owner = Role.objects.get(hotel_id=hotel, role_name=owner)
            queryset = HotelUser.objects.filter(hotel_id = hotel, role_id = owner.role_id)
        else:
            queryset = HotelUser.objects.filter(hotel_id = users)
            
        return queryset        
    
hotel_owner_account = HotelOwnerAccount.as_view()


class OwnerEditAccountUpdateView(generics.UpdateAPIView):
    
    """
        Definition: Update the hotel owner account
        Url: hotel/onwer/update_account/<int:pk>/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = HotelUserWithoutPasswordSerializer
    queryset = HotelUser.objects.all()
    # http_method_names = ['POST', 'PUT', 'PATCH']
    lookup_field = 'pk'
    
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
    
owner_account_update = OwnerEditAccountUpdateView.as_view()



class RolesListCreateView(generics.ListCreateAPIView):
    '''
        Definition : Get all the roles
        URL : roles/
    '''
    permission_classes = [IsAuthenticated]
    serializer_class = RolesSerializer
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel', '')
        if hotel:
            queryset = Role.objects.filter(hotel_id=hotel)
            return queryset
        else:
            queryset = Role.objects.all()
            return queryset
        
    
get_roles = RolesListCreateView.as_view()



class HotelUserCreateAPIView(generics.CreateAPIView):
    '''
        Definition: Create a hotel employee
        URL : hotel_employee/create/
    '''
    serializer_class = HotelUserSerializer
    queryset = HotelUser.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save()
        
        
hotel_employee = HotelUserCreateAPIView.as_view()


class HotelUserRolesListCreateAPIView(generics.ListCreateAPIView):
    '''
        Definition: Get all the roles for a given hotel
        URL : hotel_roles/?hotel=1
    '''
    permission_classes = [IsAuthenticated]
    serializer_class = HotelUserRolesSerializer
    
    def get_queryset(self):
        param = self.request.query_params.get('hotel')
        if param:
            queryset = HotelUser.objects.filter(hotel_id=param).order_by('role_id').distinct()
        return queryset
    
hotel_role = HotelUserRolesListCreateAPIView.as_view()


import pandas as pd
import numpy as np
from sales.models import ItemCategory, TaxGroup, VariantDetails, ItemVariantAddOn, Product


class DayData(generics.ListAPIView):
    '''
        Definition : Dashboard Data
    '''
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        hotel = self.request.query_params.get('hotel')
        if not hotel:
            return Response({"status": "hotel id is required"}, status.HTTP_400_BAD_REQUEST)
        
        # List of Customers added today
        customers = Customers.objects.filter(
            hotel_id=hotel, created_at__startswith=date.today().strftime("%Y-%m-%d")
        ).count()

        # List of all paid bills today
        paid_bills = Bill.objects.filter(
            hotel_id=hotel,
            created_at__startswith=date.today().strftime("%Y-%m-%d"),
            bill_status="paid",
        )

        amount_per_payment_type = (
            paid_bills.select_related("payment_type")
            .values("payment_type__name")
            .annotate(total=Sum("net_amount"))
        )
        amount_per_payment_type = [
            {"payment_type": bill["payment_type__name"], "total": bill["total"]}
            for bill in amount_per_payment_type
        ]


        orders_count_and_sales = paid_bills.aggregate(
            total=Sum("net_amount"), count=Count("bill_id")
        )
        orders_count = orders_count_and_sales["count"]
        total_sales = [orders_count_and_sales["total"]]

        # List of products ordered today
        items_delivered_today = (
            ItemOrdered.objects.filter(
                hotel_id=hotel,
                created_at__startswith=date.today().strftime("%Y-%m-%d"),
                status="delivered",
            )
            .select_related("variant", "products", "products__item_category_id")
            .values(
                "variant__price",
                "products__id",
                "products__name",
                "products__net_price",
                "products__item_category_id__item_category_name",
            )
            .annotate(
                total_quantity=Sum("quantity"),
                category=F("products__item_category_id__item_category_name"),
            )
            .order_by("-total_quantity", "products__name")
        )

        category_data = defaultdict(float)
        top_5_items = []

        for item in items_delivered_today:
            if item["variant__price"]:
                item["products__net_price"] = item["variant__price"]

            category_data[item["category"]] += (
                item["products__net_price"] * item["total_quantity"]
            )

            if len(top_5_items) < 5:
                top_5_items.append(
                    {
                        "products": item["products__name"],
                        "total_quantity": item["total_quantity"],
                    }
                )

        # Get hourly sales data
        hourly_sales_data = (
            paid_bills.extra(select={"hour": "HOUR(created_at)"})
            .values("hour")
            .annotate(total=Count("bill_id"))
        )

        hourly_sales = {sales["hour"]: sales["total"] for sales in hourly_sales_data}

        response_data = {
            "category_data": category_data,
            "top_5": top_5_items,
            "total sales": total_sales,
            "payment types": amount_per_payment_type,
            "customers": customers,
            "number_of_orders": orders_count,
            "hourly_sales": hourly_sales,
        }

        return Response(response_data)
     
dashboard = DayData.as_view()


class GetPettyCashSerializer(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PettyCashSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            return PettyCash.objects.filter(hotel=hotel)
get_pettycash_history = GetPettyCashSerializer.as_view()
    

class UpdatePettyCashSerializer(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PettyCashSerializer
    queryset = PettyCash.objects.all()
    
    
update_pettycash = UpdatePettyCashSerializer.as_view()


class ResetPettyCashSerializer(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ResetPettyCashSerializer
    queryset = PettyCash.objects.all()
    
    
reset_pettycash = ResetPettyCashSerializer.as_view()


class DayDataFor_Outlets(generics.ListAPIView):
    '''
        Definition : Dashboard Data
    '''
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            # rand_date = "2023-04-07"
            main_hotel = HotelData.objects.get(hotel_id=hotel)
            outlets_database = {}
            outlets = main_hotel.hoteldata_set.all()
            if len(outlets) > 0:
                for outlet in outlets:
                    # List of Customers added today
                    customers = Customers.objects.filter(
                        hotel_id = outlet.hotel_id, 
                        created_at__startswith=date.today().strftime("%Y-%m-%d")
                    ).count()
                    
                    # List of all the bills generated today
                    bills = Bill.objects.filter(
                        hotel_id=outlet.hotel_id, 
                        created_at__startswith=date.today().strftime("%Y-%m-%d")
                    ).exclude(bill_status="unpaid")
                    
                    # List of products ordered today
                    products = ItemOrdered.objects.filter(
                        hotel_id = outlet.hotel_id, 
                        created_at__startswith= date.today().strftime("%Y-%m-%d")
                    ).exclude(status__in=['sent','accepted', 'rejected', 'ready'])
                    
                    # List of Products ordered category wise
                    database = {}
                    category = {}
                    # Get all the category type alongs with their name
                    cat = ItemCategory.objects.filter(hotel_id = outlet.hotel_id).values()
                    # Create a dictionnary that holds the category name and its id
                    for i in cat:
                        category[i['item_category_name']] = i['item_category_id']
                        
                    # Assign all the products ordered today to its catergory
                    sold_item = {}
                    for key, cat in category.items():
                        
                        items = ItemOrdered.objects.filter(
                            hotel_id = outlet.hotel_id,
                            created_at__startswith=date.today().strftime("%Y-%m-%d"),
                            products__item_category_id = cat
                        ).exclude(status__in=['sent','accepted', 'rejected', 'ready']).values('products__id', 'products__name', 'quantity', 'products__net_price', 'bill_id')
                        
                        b = items.values(
                            'products__name','products__net_price', 'products__id', 'bill_id', 'variant'
                            ).order_by('products__name').annotate(total_quantity = Sum('quantity')) 
                        
                        sales = 0
                        for ele in b:
                            if ele['variant']:
                                ele['products__net_price'] = VariantDetails.objects.get(
                                                            hotel=outlet.hotel_id, variant_id=ele['variant']).price

                            sales += (ele['products__net_price'] * ele['total_quantity'])
                            ele['sales'] = sales
                        category[key] = sales
                        sold_item[key] = b
                        top_5 = {'top_5' : [sold_item]}
                
                    orders = products.values('products').order_by('products').annotate(total_quantity = Sum('quantity'))
                    top_5 = sorted(orders, key=lambda d: d['total_quantity'], reverse=True)[:5]
                    for ele in top_5:
                        ele['products'] = Product.objects.filter(hotel_id=outlet.hotel_id, id=ele['products']).values('name')[0]['name']
                    payment_types = bills.values('payment_type').order_by('payment_type').annotate(total=Sum('net_amount'))
                    for ele in payment_types:
                        if ele['payment_type'] != None:
                            ele['payment_type'] = PaymentCategory.objects.filter(hotel=outlet.hotel_id, id = ele['payment_type']).values('name')[0]['name']
                    addons = products.values('addon')
                    
                    l = []
                    for addon in addons:
                        if addon['addon'] != None:
                            l.append(AddOnDetails.objects.get(hotel=outlet.hotel_id, add_on_id = addon['addon']).price)
                        
                    #  [AddOnDetails.objects.get(hotel=hotel, add_on_id=addon['addon']).price  for addon in addons if addon['addon'] != None ]
                    if sum(l) != 0:
                        category['addons'] = sum(l) 
                    database['category_data'] = category
                    database['total sales'] = bills.annotate(bill=Count('bill_id')).aggregate(Sum('total_amount')).values()
                    database['top_5'] = top_5
                    database['payment types'] = payment_types
                    database['customers'] = customers
                    database['number_of_orders'] = bills.count()
                    
                    # Hourly sales
                    hours = ['0'+str(i) if len(str(i))==1 else str(i) for i in range(0, 24)]
                    hourly_sales = {}
                    for hour in hours:
                        time = date.today().strftime("%Y-%m-%d") + " " + hour
                        hourly_sales[hour] = Bill.objects.filter(
                            hotel_id=outlet.hotel_id, 
                            bill_status='paid',
                            created_at__startswith=time).exclude(bill_status='unpaid').count()
                    
                    database['hourly_sales'] = hourly_sales
                    
                    outlets_database[outlet.hotel_name] = database
                    
                return Response(outlets_database)
            else:
                return Response({"status" : "Hotel does not have outlets"}, status.HTTP_404_NOT_FOUND)
     
dashboard_outlets = DayDataFor_Outlets.as_view()
