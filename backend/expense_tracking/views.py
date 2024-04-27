from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime as date
from django.db.models import Sum
from rest_framework import status

from .models import (PurchaseProducts, ResellingProducts, Rent, Salary, Ebill)
from hotel.models import HotelData

from .serializers import (
    PurchaseProductsSerializer,ResellingProductsSerializer, 
    RentSerializer, SalarySerializer, 
    EbillSerializer
)

#---------------------------------------------------------------------------------------------------#
#                                     PurchaseProducts Views                                        #
#---------------------------------------------------------------------------------------------------#

#--------------------------------------Create and Get View------------------------------------------#
class ExpensePurchaseProductsListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseProductsSerializer

    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            return PurchaseProducts.objects.filter(hotel=hotel)
        
expense_purchase_products = ExpensePurchaseProductsListCreateAPIView.as_view()


#-----------------------------------Update and Delete View------------------------------------------#

class ExpensePurchaseProductsRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseProductsSerializer
    queryset = PurchaseProducts.objects.all()
        
retrieve_update_delete_expense_purchase = ExpensePurchaseProductsRetrieveUpdateDestroyAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                     ResellingProducts Views                                       #
#---------------------------------------------------------------------------------------------------#

#--------------------------------------Create and Get View------------------------------------------#
class ExpenseResellingProductsListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ResellingProductsSerializer

    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            return ResellingProducts.objects.filter(hotel=hotel)
        
expense_reselling_products = ExpenseResellingProductsListCreateAPIView.as_view()


#-----------------------------------Update and Delete View------------------------------------------#

class ExpenseResellingProductsRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ResellingProductsSerializer
    queryset = ResellingProducts.objects.all()
        
retrieve_update_delete_expense_reselling = ExpenseResellingProductsRetrieveUpdateDestroyAPIView.as_view()




#---------------------------------------------------------------------------------------------------#
#                                             Salary Views                                          #
#---------------------------------------------------------------------------------------------------#
#--------------------------------------Create and Get View------------------------------------------#
class SalaryListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SalarySerializer

    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            return Salary.objects.filter(hotel=hotel)
        
salary = SalaryListCreateAPIView.as_view()


#-----------------------------------Update and Delete View------------------------------------------#

class SalaryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SalarySerializer
    queryset = Salary.objects.all()
        
retrieve_update_delete_salary = SalaryRetrieveUpdateDestroyAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                             Rent View                                             #
#---------------------------------------------------------------------------------------------------#
#--------------------------------------Create and Get View------------------------------------------#
class RentListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RentSerializer

    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            return Rent.objects.filter(hotel=hotel)
        
rent = RentListCreateAPIView.as_view()


#-----------------------------------Update and Delete View------------------------------------------#

class RentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RentSerializer
    queryset = Rent.objects.all()
        
retrieve_update_delete_rent = RentRetrieveUpdateDestroyAPIView.as_view()


#---------------------------------------------------------------------------------------------------#
#                                             Ebill View                                            #
#---------------------------------------------------------------------------------------------------#
#--------------------------------------Create and Get View------------------------------------------#
class EbillListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EbillSerializer

    def get_queryset(self):
        hotel = self.request.query_params.get('hotel')
        if hotel:
            return Ebill.objects.filter(hotel=hotel)
        
ebill = EbillListCreateAPIView.as_view()


#-----------------------------------Update and Delete View------------------------------------------#

class EbillRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EbillSerializer
    queryset = Ebill.objects.all()

retrieve_update_delete_ebill = EbillRetrieveUpdateDestroyAPIView.as_view()


class MonthData(generics.ListAPIView):
    '''
        Definition : Dashboard Data
    '''
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        
        hotel = self.request.query_params.get('hotel')
        if hotel:
            database = {}
            
            purchase_products_expense = PurchaseProducts.objects.filter(
                hotel=hotel, created_at__startswith=date.today().strftime("%Y-%m")
                ).values('total_price').aggregate(
                    total_price = Sum('total_price'),
                    total_extra_charges = Sum('extracharges')
                )
            
            reselling_products_expense = ResellingProducts.objects.filter(
                hotel=hotel, created_at__startswith=date.today().strftime("%Y-%m")
                ).values('total_price').aggregate(
                    total_price = Sum('total_price'),
                    total_extra_charges = Sum('extracharges')
                )
            
            salary = Salary.objects.filter(
                hotel=hotel, created_at__startswith=date.today().strftime("%Y-%m")
                ).values('salary').aggregate(total_salary = Sum('salary'))
            
            rent = Rent.objects.filter(
                hotel=hotel, created_at__startswith=date.today().strftime("%Y-%m")
                ).values('price').aggregate(total_price = Sum('price'))
            
            ebill = Ebill.objects.filter(
                hotel=hotel, created_at__startswith=date.today().strftime("%Y-%m")
                ).values('price').aggregate(total_price = Sum('price'))
            
            if purchase_products_expense['total_price']:
                database['Purchase Products'] = purchase_products_expense['total_price'] + purchase_products_expense['total_extra_charges']
            else:
                database['Purchase Products'] = 0
            
            if reselling_products_expense['total_price']:
                database['Reselling Products'] = reselling_products_expense['total_price'] + reselling_products_expense['total_extra_charges']
            else:
                database['Reselling Products'] = 0
            
            if salary['total_salary']:
                database['Salary'] = salary['total_salary']
            else:
                database['Salary'] = 0

            if rent['total_price']:
                database['Rent'] = rent['total_price']
            else:
                database['rent'] = 0
            
            if ebill['total_price']:
                database['Ebill'] = ebill['total_price']
            else:
                database['Ebill'] = 0
            
            return Response(database)
     
expense_dashboard = MonthData.as_view()




class Outlets_MonthData(generics.ListAPIView):
    '''
        Definition : Dashboard for Monthly Data
    '''
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        
        hotel = self.request.query_params.get('hotel')
        if hotel:
            main_hotel = HotelData.objects.get(hotel_id=hotel)
            outlets_database = {}
            database = {}
            outlets = main_hotel.hoteldata_set.all()
            if len(outlets) > 0:
                for outlet in outlets:
                    purchase_products_expense = PurchaseProducts.objects.filter(
                        hotel=outlet.hotel_id, created_at__startswith=date.today().strftime("%Y-%m")
                        ).values('total_price').aggregate(
                            total_price = Sum('total_price'),
                            total_extra_charges = Sum('extracharges')
                        )
                    
                    reselling_products_expense = ResellingProducts.objects.filter(
                        hotel=outlet.hotel_id, created_at__startswith=date.today().strftime("%Y-%m")
                        ).values('total_price').aggregate(
                            total_price = Sum('total_price'),
                            total_extra_charges = Sum('extracharges')
                        )
                    
                    salary = Salary.objects.filter(
                        hotel=outlet.hotel_id, created_at__startswith=date.today().strftime("%Y-%m")
                        ).values('salary').aggregate(total_salary = Sum('salary'))
                    
                    rent = Rent.objects.filter(
                        hotel=outlet.hotel_id, created_at__startswith=date.today().strftime("%Y-%m")
                        ).values('price').aggregate(total_price = Sum('price'))
                    
                    ebill = Ebill.objects.filter(
                        hotel=outlet.hotel_id, created_at__startswith=date.today().strftime("%Y-%m")
                        ).values('price').aggregate(total_price = Sum('price'))
                    
                    if purchase_products_expense['total_price']:
                        database['Purchase Products'] = purchase_products_expense['total_price'] + purchase_products_expense['total_extra_charges']
                    else:
                        database['Purchase Products'] = 0
                    
                    if reselling_products_expense['total_price']:
                        database['Reselling Products'] = reselling_products_expense['total_price'] + reselling_products_expense['total_extra_charges']
                    else:
                        database['Reselling Products'] = 0
                    
                    if salary['total_salary']:
                        database['Salary'] = salary['total_salary']
                    else:
                        database['Salary'] = 0

                    if rent['total_price']:
                        database['Rent'] = rent['total_price']
                    else:
                        database['rent'] = 0
                    
                    if ebill['total_price']:
                        database['Ebill'] = ebill['total_price']
                    else:
                        database['Ebill'] = 0
                        
                    outlets_database[outlet.hotel_name] = database
                    
                return Response(outlets_database)
            else:
                return Response({"status" : "Hotel does not have outlets"}, status.HTTP_404_NOT_FOUND)
     
outlets_expense_dashboard = Outlets_MonthData.as_view()


