import csv
import io

import numpy as np
import pandas as pd
from django.core.exceptions import ValidationError
from django.shortcuts import render
from django_filters import rest_framework as filters
from rest_framework import (authentication, generics, mixins, permissions,
                            status, viewsets)
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from hotel.models import HotelData
from inventory.models import InventoryProduct

from .models import (AddOnDetails, Bill, Customers, HotelTableStatus,
                     ItemCategory, ItemOrdered, ItemVariantAddOn,
                     PaymentCategory, Product, TableOrder, TakeAway, TaxGroup,
                     VariantDetails)
from .serializers import (AddOnDetailsSerializer, BillSerializer,
                          CategorySerializer, CustomersSerializer,
                          FileUploadSerializer, HotelOrderSerializer,
                          HotelTableOrdersSerializer,
                          HotelTableStatusSerializer,
                          HotelTakeAwayOrdersSerializer,
                          IndividualOrderedItemSerializer,
                          ItemsCategorySerializer, ItemsCreateSerializer,
                          ItemsSerializer, ItemVariantAddOnSerializer,
                          OneBillSerializer, OrderDetailsSerializer,
                          PaymentCategorySerializer, ProductSerializer,
                          TableOrderSerializer, TakeAwaySerializer,
                          TaxGroupSerializer, VariantDetailsSerializer)

#---------------------------------------------------------------------------------------------------#
#                                          Get all the Products/Items                               #
#                                          URL : items/                                             #
#---------------------------------------------------------------------------------------------------#

class ItemsListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemsSerializer
    
    def get_queryset(self):
        try:
            hotel = self.request.query_params.get('id')
        except:
            return status.HTTP_406_NOT_ACCEPTABLE
        if hotel:
            # The following will result in total 5 queries
            # 1 - products table, 2 - inventoryproduct reverse lookup, 3 - itemvariantaddon reverse lookup, 4 - itemvariantaddon variant details forward lookup, 5 - itemvariantaddon item_add_on details forward lookup
            # The responses from 5 queries are serialized into a response using 
            queryset = (
                Product.objects.filter(hotel_id=hotel)
                .select_related("hotel_id", "tax_group_id", "item_category_id")
                .prefetch_related(
                    "inventoryproduct_set",
                    "itemvariantaddon_set",
                    "itemvariantaddon_set__variant",
                    "itemvariantaddon_set__item_add_on",
             )
            )  # TODO: implement pagination - but perfomance is fine for now

            return queryset
        else:
            queryset = Product.objects.all()
            return queryset
            
    
items_list_create_view = ItemsListCreateAPIView.as_view()



#---------------------------------------------------------------------------------------------------#
#                     Get the different item/product category that a given hotel has                #
#                                          URL : hotel/item_category/                               #
#---------------------------------------------------------------------------------------------------#

class ItemsCategoryListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    
    def get_queryset(self):
        try:
            hotel = self.request.query_params.get('id')
        except:
            return status.HTTP_406_NOT_ACCEPTABLE
        if hotel:
            queryset = ItemCategory.objects.filter(hotel_id=hotel)
        return queryset
        
items_category = ItemsCategoryListCreateView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                       Adding new Item/Product                                     #
#                                          URL : add_item/                                          #
#---------------------------------------------------------------------------------------------------#

class ItemsListCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemsCreateSerializer
    queryset = Product.objects.all()
item_create_view = ItemsListCreateAPIView.as_view()

#---------------------------------------------------------------------------------------------------#
#                              Get a detail of a particalar item/product                            #
#                                           URL : add_item/<int:pk>/                                #
#---------------------------------------------------------------------------------------------------#

class ItemDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ItemsSerializer
    # lookup_field = 'id'
    
item_detail_view = ItemDetailAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                       Get All the Items/Products related to a given category                      #
#                                           URL : item_category/                                    #
#---------------------------------------------------------------------------------------------------#

class ItemDetailByCategoryAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = ItemsCategorySerializer
 
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel', '')
        name = self.request.query_params.get('category', '')
        if hotel and name:
            queryset = Product.objects.filter(hotel_id=hotel, item_category_id=name)
        return queryset
item_detail_by_category_view = ItemDetailByCategoryAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                          Update an Item                                           #
#                                          URL : items/update/<int:pk>/                             #
#---------------------------------------------------------------------------------------------------#

@api_view(['POST']) 
def item_update_view(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)
    tax_id = data['tax_group_id']
    unit_price = data['unit_price']
    tax_value = TaxGroup.objects.get(tax_group_id=tax_id).tax_value
    net_price = unit_price + (unit_price * tax_value)/100.0
    data['net_price'] = int(net_price)
    serializer = ProductSerializer(instance=product, data=data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

#---------------------------------------------------------------------------------------------------#
#                                          Delete an Item                                           #
#                                          URL : items/delete/<int:pk>/                             #
#---------------------------------------------------------------------------------------------------#
class ItemDestroyAPIView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, ]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    lookup_field = 'pk'
    
    def perfom_update(self, instance):
       # instance
       # return Response(data={'status' : status.HTTP_200_OK}, status=None, template_name=None, headers=None, content_type=None)
       super().perform_destroy(instance)
       

item_delete_view = ItemDestroyAPIView.as_view()
    
    

#---------------------------------------------------------------------------------------------------#
#                      Create or Get list of customers we have for a given hotel                    #
#                                          URL :customers/                                          #
#---------------------------------------------------------------------------------------------------#  

class CustomerCreateListAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = CustomersSerializer
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = Customers.objects.filter(hotel_id=hotel)
            if queryset is None:
                queryset = Customers.objects.all()
        else:
            return None
        return queryset
    
customer_create_list_view = CustomerCreateListAPIView.as_view()
    

#---------------------------------------------------------------------------------------------------#
#                      Get a customer details searched by its mobile number                         #
#                              URL :customers/?hotel=1&mobile=1                                     #
#---------------------------------------------------------------------------------------------------#  

class CustomerListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = CustomersSerializer

    def get_queryset(self):
        hotel = self.request.query_params.get('hotel', '')
        mobile = self.request.query_params.get('mobile', '')
        if hotel and mobile:
            queryset = Customers.objects.filter(hotel_id=hotel, customer_mobile=mobile)
            return queryset
        
customer_detail_view = CustomerListCreateAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                      Get the receipt of a given bill of particular hotel                          #
#                              URL :receipts/print/<str:pk>/                                        #
#---------------------------------------------------------------------------------------------------#  

class RecieptDetailRetrieveAPIView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = BillSerializer
    queryset =   Bill.objects.all()

receipt = RecieptDetailRetrieveAPIView.as_view()
     
     
#---------------------------------------------------------------------------------------------------#
#                                   All the receipts for a given Hotel                              #
#                                              URL :receipts/?hotel=1                               #
#---------------------------------------------------------------------------------------------------#  

class ReceiptListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = BillSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = Bill.objects.filter(hotel_id=hotel)
            if queryset is None:
                queryset = Bill.objects.all()
        else:
            return None
        return queryset
 
receipts = ReceiptListCreateAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                              All the receipts                                     #
#                                              URL :all-receipts/                                   #
#---------------------------------------------------------------------------------------------------#  

class ReceiptListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = BillSerializer
    queryset =   Bill.objects.all()
    
get_all_receipt = ReceiptListCreateAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                              Place an order                                       #
#                                              URL :order_ticket/                                   #
#---------------------------------------------------------------------------------------------------#  

class OrderDetailsCreateListeView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderDetailsSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel', '')
        
        if hotel:
            queryset = ItemOrdered.objects.filter(hotel_id=hotel)
        else:
            queryset = ItemOrdered.objects.all()
        return queryset

order_ticket = OrderDetailsCreateListeView.as_view()
    

#---------------------------------------------------------------------------------------------------#
#                                     Get all orders given hotel                                    #
#                                       URL :orders/?hotel=1                                        #
#---------------------------------------------------------------------------------------------------#  

class OrderCreateListeView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HotelOrderSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel', '')
        
        if hotel:
            queryset = ItemOrdered.objects.filter(hotel_id=hotel)
        else:
            queryset = ItemOrdered.objects.all()
        return queryset

orders = OrderCreateListeView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                          Get the table status                                     #
#                                    URL :table_status/  & create_table/                            #
#---------------------------------------------------------------------------------------------------#  

class HotelTableStatusCreateListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HotelTableStatusSerializer
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = HotelTableStatus.objects.filter(hotel_id=hotel)
        else:
            queryset = HotelTableStatus.objects.all()
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

table_status = HotelTableStatusCreateListView.as_view()

#---------------------------------------------------------------------------------------------------#
#                                          Update table status                                      #
#                                        URL :table_update/<int:pk>/                                #
#---------------------------------------------------------------------------------------------------#  

@api_view(['POST'])     
def table_update(request, pk):
    status = HotelTableStatus.objects.get(table_id=pk)
    
    if request.method == 'POST':
        data = request.data
        customer = data.get('customer_id', 'null')
        if customer == 'null':
            data['customer_id'] = None
    serializer = HotelTableStatusSerializer(instance=status, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

#---------------------------------------------------------------------------------------------------#
#                              Get all the different variants of hotel                              #
#                                        URL :items/variants/                                       #
#---------------------------------------------------------------------------------------------------#
class VariantDetailsSerializerListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VariantDetailsSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        category = self.request.query_params.get('group') or None
        if hotel and category is None:
            queryset = VariantDetails.objects.filter(hotel_id=hotel)
        else:
            queryset = VariantDetails.objects.filter(hotel_id=hotel, variant_value=category)
        return queryset
    
get_variants = VariantDetailsSerializerListCreateView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                Get/Create Variant add on details                                  #
#                                   URL :items/variants/add_on/                                     #
#---------------------------------------------------------------------------------------------------#
class ItemVariantAddOnSerializerListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemVariantAddOnSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        category = self.request.query_params.get('group') or None
        if hotel and category is None:
            queryset = ItemVariantAddOn.objects.filter(hotel_id=hotel)
        else:
            queryset = ItemVariantAddOn.objects.filter(hotel_id=hotel, variant=category)
        return queryset
    
add_on_variants = ItemVariantAddOnSerializerListCreateView.as_view()




#---------------------------------------------------------------------------------------------------#
#                                   Update Variant add on details                                   #
#                                   URL :items/variants/add_on/update                               #
#---------------------------------------------------------------------------------------------------#
class ItemVariantAddOnSerializerUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemVariantAddOnSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = ItemVariantAddOn.objects.filter(hotel_id=hotel)
            return queryset

    
add_on_variants_update = ItemVariantAddOnSerializerUpdateView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                         Get all the add on values                                 #
#                                            URL :items/add_on/                                     #
#---------------------------------------------------------------------------------------------------#
class AddOnDetailsSerializerListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddOnDetailsSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        category = self.request.query_params.get('add_on') or None
        if hotel and category is None:
            queryset = AddOnDetails.objects.filter(hotel_id=hotel)
        else:
            queryset = AddOnDetails.objects.filter(hotel_id=hotel, add_on_value=category)
        return queryset
    
    
add_on_details = AddOnDetailsSerializerListCreateView.as_view()


#---------------------------------------------------------------------------------------------------#
#                         Get all the add on and variant for a given product                        #
#                            URL :product/variants/addons/?hotel=1&product=1                        #
#---------------------------------------------------------------------------------------------------#
class ProductVariantAddOnSerializerListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemVariantAddOnSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        product = self.request.query_params.get('product')
        addon = self.request.query_params.get('addon') or None
        variant = self.request.query_params.get('variant') or None
        if hotel and product:
            queryset = ItemVariantAddOn.objects.filter(hotel=hotel, item_id=product)
        return queryset

product_variants_addons = ProductVariantAddOnSerializerListCreateView.as_view()

#---------------------------------------------------------------------------------------------------#
#                                    1- Get all the Tax groups                                      #
#                                        URL :tax_groups/                                           #
#                                    2- Add tax group to the given hotel                            #
#                                        URL : add_tax/                                             #
#---------------------------------------------------------------------------------------------------#
class TaxGroupListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxGroupSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = TaxGroup.objects.filter(hotel_id=hotel)
        else:
            queryset = TaxGroup.objects.all()
        return queryset
    
tax_groups = TaxGroupListCreateView.as_view()

#?---------------------------------------------------------------------------------------------------#
#?                             Update the tax group of a particular hotel                            #
#?                                        URL :tax_update/<int:pk>/                                  #
#?---------------------------------------------------------------------------------------------------#

# Update table status view
@api_view(['POST'])     
def tax_update(request, pk):
    value = TaxGroup.objects.get(tax_group_id=pk)
    serializer = TaxGroupSerializer(instance=value, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(status=value.HTTP_404_NOT_FOUND)



#?---------------------------------------------------------------------------------------------------#
#?                                    1- Get all the Payment Categories                              #
#?                                        URL :payment_types/?hotel=1  GET                           #
#?                                    2- Add payment type to the given hotel                         #
#?                                        URL : payment_types/   POST                                #
#?---------------------------------------------------------------------------------------------------#
class PaymentCategorySerializerListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentCategorySerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            queryset = PaymentCategory.objects.filter(hotel=hotel)
            return queryset
    
payment_types = PaymentCategorySerializerListCreateView.as_view()





#?---------------------------------------------------------------------------------------------------#
#?                      1- Get all the orders attached to a given table when occupied                #
#?                             URL :table_orders/?hotel=1&status='occupied'  GET                     #
#?---------------------------------------------------------------------------------------------------#
class HotelTableOrdersRetrieveAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HotelTableOrdersSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel', '')
        status = self.request.query_params.get('status', '')
        if hotel and status=='occupied':
            queryset = HotelTableStatus.objects.filter(hotel_id = hotel, status="occupied")
        return queryset
    
hotel_table_occ_orders = HotelTableOrdersRetrieveAPIView.as_view()



#?---------------------------------------------------------------------------------------------------#
#?                           Retrieve a receipt information given bill id                            #
#?                                    URL : receipt/1/?bill=1                                        #
#?---------------------------------------------------------------------------------------------------#
class BillInfoSerializerRetriveAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OneBillSerializer
    queryset =Bill.objects.all()

    
hotel_bill = BillInfoSerializerRetriveAPIView.as_view()


#?---------------------------------------------------------------------------------------------------#
#?                                          Delete an Item                                           #
#?                                          URL : items/delete/<int:pk>/                             #
#?---------------------------------------------------------------------------------------------------#
class CategorySerializerUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = ItemCategory.objects.all()


update_item_category = CategorySerializerUpdateDestroyAPIView.as_view()


generics.RetrieveUpdateDestroyAPIView


#?---------------------------------------------------------------------------------------------------#
#?                                          Delete an tax                                            #
#?                                          URL : delete_tax_group/<int:pk>/                         #
#?---------------------------------------------------------------------------------------------------#
class TaxDestroyAPIView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, ]
    queryset = TaxGroup.objects.all()
    serializer_class = TaxGroupSerializer
    
    
    def perfom_update(self, instance):
       super().perform_destroy(instance)
       

delete_tax_group = TaxDestroyAPIView.as_view()



#?---------------------------------------------------------------------------------------------------#
#?                                       Update and Delete Addon                                     #
#?                                       URL : addon/update_delete/<int:pk>/                         #
#?---------------------------------------------------------------------------------------------------#
class AddOnDetailsSerializerUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddOnDetailsSerializer
    queryset = AddOnDetails.objects.all()


update_delete_addon = AddOnDetailsSerializerUpdateDestroyAPIView.as_view()

#?---------------------------------------------------------------------------------------------------#
#?                                       Update and Delete Addon                                     #
#?                                       URL : addon/update_delete/<int:pk>/                         #
#?---------------------------------------------------------------------------------------------------#
class VariantDetailsSerializerUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VariantDetailsSerializer
    queryset = VariantDetails.objects.all()
    
update_delete_variant = VariantDetailsSerializerUpdateDestroyAPIView.as_view()


#?---------------------------------------------------------------------------------------------------#
#?                                  Update and Delete Payment Category                               #
#?                                  URL : payment/update_delete/<int:pk>/                            #
#?---------------------------------------------------------------------------------------------------#
class PaymentCategorySerializerUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentCategorySerializer
    queryset = PaymentCategory.objects.all()
    
update_delete_payment = PaymentCategorySerializerUpdateDestroyAPIView.as_view()


#?---------------------------------------------------------------------------------------------------#
#?                                  Product download format                                          #
#?                                  URL : download_products/?hotel=1                                 #
#?---------------------------------------------------------------------------------------------------#
import csv

from django.http import HttpResponse
from rest_framework.views import APIView


class download_product(APIView):
    def get(self, request, format=None):
        hotel = self.request.query_params.get('hotel')
        categories = self.request.query_params.get('categories', False)
        response = HttpResponse(content_type='text/csv')
        if hotel:
            response['Content-Disposition'] = 'attachment; filename="export.csv"'
            writer = csv.DictWriter(response, 
                                    fieldnames=[
                                        'NAME', 'CATEGORY', 'VARIANTS', 'PRICE', 'QUANTITY',
                                        'TAX NAME' ,'TAX PERCENTAGE', 
                                        'ADDONS'
                                    ])
            
            writer.writeheader()
            if categories:
                for category in categories.split(','):
                    for product in ItemCategory.objects.get(
                        hotel_id=hotel, 
                        item_category_name=category
                        ).product_set.all():
                        
                        ele = {}
                        ele['VARIANTS'] = ''
                        if product.unit_price == 0:
                            ele['PRICE'] = ''
                            variants = list(ItemVariantAddOn.objects.get(
                                hotel_id=hotel, 
                                item_id=product.id
                            ).variant.all())
                            for variant in variants:
                                inventory = product.inventoryproduct_set.all()
                                if len(inventory) > 0:
                                    # check the quantity
                                    for var in inventory:
                                        if var.variant.variant_value == variant.variant_value:
                                            if var.quantity > 0:
                                                ele['QUANTITY'] = var.quantity
                                            else:
                                                ele['QUANTITY'] = 0
                                else:
                                    ele['QUANTITY'] = 0
                                    
                                check = ele.get('QUANTITY', None)
                                if check is None:
                                    ele['QUANTITY'] = 0
                                ele['NAME'] = product.name
                                ele['CATEGORY'] = category
                                ele['VARIANTS'] = variant.variant_value
                                ele['PRICE'] = variant.price
                                ele['TAX NAME'] = product.tax_group_id.tax_group_name
                                ele['TAX PERCENTAGE'] =  str(product.tax_group_id.tax_value) + "%"
                                addons = list(ItemVariantAddOn.objects.filter(hotel_id=hotel, item_id=product.id))
                                if len(addons) != 0:
                                    pass
                                else:
                                    ele['ADDONS'] = ''
                                
                                writer.writerow(ele)
                        else:
                            inventory = product.inventoryproduct_set.all()
                            if len(inventory) > 0:
                                ele['QUANTITY'] = inventory[0].quantity
                            else:
                                ele['QUANTITY'] = 0
                                
                            ele['PRICE'] = product.unit_price
                            ele['NAME'] = product.name
                            ele['CATEGORY'] = category
                            ele['TAX NAME'] = product.tax_group_id.tax_group_name
                            ele['TAX PERCENTAGE'] =  str(product.tax_group_id.tax_value) + "%"
                            addons = list(ItemVariantAddOn.objects.filter(hotel_id=hotel, item_id=product.id))
                            if len(addons) != 0:
                                pass
                            else:
                                ele['ADDONS'] = ''
                        
                            writer.writerow(ele)
                return response
            else:
                for ele in list(Product.objects.filter(hotel_id=hotel).values(
                    'id', 
                    'name', 
                    'item_category_id', 
                    'unit_price', 
                    'tax_group_id'
                )):
                    id = ele['id']
                    ele['VARIANTS'] = ''
                    name = ele['name']
                    category_id = ele['item_category_id']
                    tax_group_id = ele['tax_group_id']
                    unit_price = ele['unit_price']
                    if ele['unit_price'] == 0:
                        # ele['net_price'] = ''																	
                        variants = list(ItemVariantAddOn.objects.get(hotel_id=hotel, item_id=id).variant.all())
                        for variant in variants:
                            data = {}
                            data['VARIANTS'] = variant.variant_value
                            data['PRICE'] = variant.price
                            data['NAME'] = name
                            data['CATEGORY'] = ItemCategory.objects.get(
                                hotel_id=hotel, 
                                item_category_id = category_id
                                ).item_category_name
                            data['TAX NAME'] = TaxGroup.objects.get(
                                hotel_id=hotel, 
                                tax_group_id=tax_group_id
                                ).tax_group_name
                            data['TAX PERCENTAGE'] =  str(TaxGroup.objects.get(
                                hotel_id=hotel, 
                                tax_group_id=tax_group_id
                                ).tax_value) + "%"
                            
                            addons = list(ItemVariantAddOn.objects.filter(hotel_id=hotel, item_id=id))
                            if len(addons) != 0:
                                pass
                            else:
                                data['ADDONS'] = ''
                            
                            inventory = variant.inventoryproduct_set.all()
                            if len(inventory) > 0:
                                for var in inventory:
                                    if var.variant.variant_value == data['VARIANTS']:
                                        data['QUANTITY'] = var.quantity
                                    else:
                                        pass
                            else:
                                data['QUANTITY'] = 0

                            writer.writerow(data)
                            
                    else:

                        ele['VARIANTS'] = ''
                        ele['PRICE'] = unit_price
                        ele['NAME'] = name
                        ele['CATEGORY'] = ItemCategory.objects.get(
                            hotel_id=hotel, 
                            item_category_id = category_id
                            ).item_category_name
                        ele['TAX NAME'] = TaxGroup.objects.get(
                            hotel_id=hotel, 
                            tax_group_id=tax_group_id
                            ).tax_group_name
                        ele['TAX PERCENTAGE'] =  str(TaxGroup.objects.get(
                            hotel_id=hotel, 
                            tax_group_id=tax_group_id
                            ).tax_value) + "%"
                        
                        addons = list(ItemVariantAddOn.objects.filter(hotel_id=hotel, item_id=id))
                        if len(addons) != 0:
                            pass
                        else:
                            ele['ADDONS'] = ''
                        
                        product = Product.objects.get(id=ele['id'])
                        inventory = product.inventoryproduct_set.all()
                        if len(inventory) > 0:
                            ele['QUANTITY'] = inventory[0].quantity
                        else:
                            ele['QUANTITY'] = 0
                        
                        del ele['id']
                        del ele['name']
                        del ele['item_category_id']
                        del ele['unit_price']
                        del ele['tax_group_id']
                        writer.writerow(ele)
                    
                return response
        else:
            return HttpResponse(status.HTTP_404_NOT_FOUND)
            
    
download_products = download_product.as_view()


#---------------------------------------------------------------------------------------------------#
#                                  Product Upload API view                                          #
#                                  URL : upload_products/?hotel=1                                   #
#---------------------------------------------------------------------------------------------------#
class UploadFileView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    def post(self, request, *args, **kwargs):
        user = None
        if request and hasattr(request, "user"):
            user = request.user
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data['file']
        hotel = serializer.validated_data['hotel']
        extension = str(file).split('.')[-1]
        # data = pd.read_csv(file)
        if extension == 'csv':
            data = pd.read_csv(file)
        elif extension in ['xlsx', 'xls']:
            data = pd.read_excel(file)
            
        if hotel:
            hotel=HotelData.objects.get(hotel_id=hotel)
            for category in data.CATEGORY.unique():
                ItemCategory.objects.get_or_create(hotel_id=hotel, item_category_name=category)

            for i, row in data.iterrows():
                print(i)
                if extension in ['xlsx', 'xls']:
                    tax = TaxGroup.objects.get_or_create(hotel_id=hotel, tax_group_name=row['TAX NAME'], tax_value=row['TAX PERCENTAGE'] * 100)[0]
                if extension == 'csv':
                    tax = TaxGroup.objects.get_or_create(hotel_id=hotel, tax_group_name=row['TAX NAME'], tax_value=str(row['TAX PERCENTAGE']).split('%')[0])[0]
                
                category = ItemCategory.objects.get(
                    hotel_id=hotel, 
                    item_category_name=row['CATEGORY']
                )
                
                if row['VARIANTS'] is not np.nan:
                    product = Product.objects.get_or_create(
                        hotel_id=hotel, 
                        name=row['NAME'], 
                        unit_price = 0,
                        item_category_id = category,
                        tax_group_id = tax
                    )
                    
                   
                    variant = VariantDetails.objects.get_or_create(
                            hotel=hotel, 
                            variant_value = row['VARIANTS'],
                            price = row['PRICE'],
                            variant_desc = row['VARIANTS']
                        )
                    
                    item_variant_addon = ItemVariantAddOn.objects.get_or_create(
                        hotel = hotel,
                        item_id = product[0],
                    )
                    
                    item_variant_addon[0].variant.add(variant[0])
                    
                    if row['QUANTITY'] !=0:
                        InventoryProduct.objects.get_or_create(
                            hotel=hotel, 
                            user = user,
                            product_id=product[0],
                            variant=variant[0],
                            action = 'created',
                            quantity = int(row['QUANTITY']),
                            expiry_date = None
                        )

                        
                else:
                    product = Product.objects.get_or_create(
                        hotel_id=hotel, 
                        name=row['NAME'], 
                        unit_price = int(row['PRICE']),
                        item_category_id = category,
                        tax_group_id = tax
                    )
                    if row['QUANTITY'] !=0:
                        InventoryProduct.objects.create(
                            hotel=hotel, 
                            user = user,
                            product_id=product[0],
                            variant=None,
                            action = 'created',
                            quantity = int(row['QUANTITY']),
                            expiry_date = None
                        )
                    
        return Response({"status": "success"}, status.HTTP_201_CREATED)

upload_products = UploadFileView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                  Kitchen Orders API view                                          #
#                                  URL : kitchen_orders/?hotel=1                                    #
#---------------------------------------------------------------------------------------------------#


class TableOrderSerializerListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TableOrderSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            orders = []
            tables = TableOrder.objects.filter(hotel_id=hotel).order_by('-created_at')
            for table in tables:
                if table.order_status != 'delivered' and table.table_id.status == 'occupied' and table.bill_id.bill_status == 'unpaid':
                    print(table.bill_id.bill_status)
                    orders.append(table)
            return orders 
        return status.HTTP_400_BAD_REQUEST
    
kitchen_orders = TableOrderSerializerListAPIView.as_view()

class TableOrderSerializerRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TableOrderSerializer
    queryset = TableOrder.objects.all()
    
kitchen_order_retrieve_update_delete = TableOrderSerializerRetrieveUpdateDestroyAPIView.as_view()



class TakeAwayOrderSerializerListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TakeAwaySerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            orders = []
            takeaways = TakeAway.objects.filter(hotel_id=hotel).order_by('-created_at')
            for takeaway in takeaways:
                if takeaway.order_status != 'delivered' and takeaway.bill_id.bill_status == 'unpaid':
                    orders.append(takeaway)
            return orders 
        return status.HTTP_400_BAD_REQUEST
    
kitchen_takeaways = TakeAwayOrderSerializerListAPIView.as_view()

class TakeAwayOrderSerializerRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TakeAwaySerializer
    queryset = TakeAway.objects.all()
    
kitchen_takeaway_retrieve_update_delete = TakeAwayOrderSerializerRetrieveUpdateDestroyAPIView.as_view()


#?---------------------------------------------------------------------------------------------------#
#?                      1- Get all the orders attached to a given table when occupied                #
#?                             URL :takeaway_orders/?hotel=1&  GET                                   #
#?---------------------------------------------------------------------------------------------------#
class HotelTakeAwayOrdersRetrieveAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HotelTakeAwayOrdersSerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel',None)
        if hotel:
            queryset = TakeAway.objects.filter(hotel_id = hotel)
        return queryset
    
hotel_takeaway_orders = HotelTakeAwayOrdersRetrieveAPIView.as_view()


#?---------------------------------------------------------------------------------------------------#
#?                      1- Get all the orders attached to a given table when occupied                #
#?                             URL :takeaway_orders/?hotel=1&  GET                                   #
#?---------------------------------------------------------------------------------------------------#
class IndividualOrderedSerializerRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IndividualOrderedItemSerializer
    queryset = ItemOrdered.objects.all()
    
ordered_item_retrieve_update_delete = IndividualOrderedSerializerRetrieveUpdateDestroyAPIView.as_view()


class SellTakeAwayOrderSerializerListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TakeAwaySerializer
    
    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            orders = []
            takeaways = TakeAway.objects.filter(hotel_id=hotel).order_by('-created_at')
            for takeaway in takeaways:
                if takeaway.bill_id.bill_status == 'unpaid':
                    orders.append(takeaway)
            return orders 
        return status.HTTP_400_BAD_REQUEST
    
sell_takeaways = SellTakeAwayOrderSerializerListAPIView.as_view()


