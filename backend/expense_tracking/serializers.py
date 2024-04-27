from rest_framework import serializers

from . models import (
    PurchaseProducts,ResellingProducts, Salary, Rent, Ebill
)

from sales.models import Product, ItemVariantAddOn, VariantDetails
from inventory.models import InventoryProduct

from sales.serializers import ItemsCategorySerializer, PaymentInfoSerializer
from hotel.serializers import HotelUserForSalary_Serializer

#---------------------------------------------------------------------------------------------------#
#                                     PurchaseProducts Serializer                                   #
#---------------------------------------------------------------------------------------------------#

class PurchaseProductsSerializer(serializers.ModelSerializer):
    payment_info = PaymentInfoSerializer(source='payment_type', read_only=True)
    class Meta:
        model = PurchaseProducts
        fields = [
            'hotel',
            'id',
            'name',
            'uom',
            'quantity',
            'unit_price',
            'total_price',
            'vendor_name',
            'extracharges',
            'payment_type',
            'payment_info',
            'created_at'
        ]
        
    lookup_field = 'id'
    
    def create(self, validated_data):
        total_price = validated_data['unit_price'] * validated_data['quantity']
        return PurchaseProducts.objects.create(total_price=total_price, **validated_data)



#---------------------------------------------------------------------------------------------------#
#                                    ResellingProducts Serializer                                   #
#---------------------------------------------------------------------------------------------------#

class ResellingProductsSerializer(serializers.ModelSerializer):
    related_name = serializers.CharField(source='related_to_product.name', read_only=True)
    payment_info = PaymentInfoSerializer(source='payment_type', read_only=True)
    variant_name = serializers.CharField(source='variant.variant_value', read_only=True)
    class Meta:
        model = ResellingProducts
        fields = [
            'hotel',
            'id',
            'uom',
            'quantity',
            'unit_price',
            'total_price',
            'vendor_name',
            'extracharges',
            'related_to_product',
            'related_name',
            'variant',
            'variant_name',
            'payment_type',
            'payment_info',
            'profit',
            'created_at'
        ]
        
    lookup_field = 'id'
    
    
    def create(self, validated_data):
        # Get the current active user
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            
        variant = validated_data['variant']
        hotel = validated_data['hotel']
        related_product = validated_data['related_to_product']
        if variant == None:
            reselling_price = Product.objects.get(hotel_id=hotel, id=related_product.id).net_price
            profit = (reselling_price - validated_data['unit_price']) * validated_data['quantity']
            total_price = validated_data['unit_price'] * validated_data['quantity']

            # Update the Inventory table automatically
            product = InventoryProduct.objects.filter(
                hotel=hotel,
                product_id=related_product
            )
            if len(product) > 0: # Check if this product has an inventory or not
            # The quantity will increase and the description will be "Product Refillment"
                product[0].quantity = product[0].quantity + validated_data['quantity']
                product[0].action = 'refill'
                product[0].save()
                
            else: # Create the Inventory Product
                print("PRODUCT", product)
                print("LEN PRODUCT", len(product))
                inventory_product = InventoryProduct.objects.create(
                        hotel=hotel, 
                        user = user,
                        product_id=related_product,
                        variant=None,
                        action = 'created',
                        quantity = validated_data['quantity'],
                        expiry_date = None
                    )
                # inventory_product.save()
                
            return ResellingProducts.objects.create(profit=profit, total_price=total_price, **validated_data)
        
        else:
            reselling_price = VariantDetails.objects.get(hotel=hotel, variant_id=variant.variant_id).price
            profit = (reselling_price - validated_data['unit_price']) * validated_data['quantity']
            total_price = validated_data['unit_price'] * validated_data['quantity']
            
            # Update the Inventory table automatically
            product = InventoryProduct.objects.filter(
                        variant=variant.variant_id,
                        hotel=hotel, 
                        product_id=related_product.id
                    )
            # The quantity will increase and the description will be "Product Refillment"
            if len(product) > 0:
                product[0].quantity = product[0].quantity + validated_data['quantity']
                product[0].action = 'refill'
                product[0].save()
            else:
                print("PRODUCT", product)
                print("LEN PRODUCT", len(product))
                inventory_product = InventoryProduct.objects.create(
                        hotel=hotel, 
                        user = user,
                        product_id=related_product,
                        variant=variant,
                        action = 'created',
                        quantity = validated_data['quantity'],
                        expiry_date = None
                    )
                # inventory_product.save()
            return ResellingProducts.objects.create(profit=profit, total_price=total_price, **validated_data)
        
    def update(self, instance, validated_data, *args, **kwargs):
        hotel = validated_data['hotel']
        related_product = validated_data['related_to_product']
        if instance.variant == None:
            profit = (instance.net_price - validated_data['unit_price']) * validated_data['quantity']
            total_price = validated_data['unit_price'] * validated_data['quantity']
            previous_quantity = instance.quantity
            
            print("PREVIOUS_QUANTITY", previous_quantity)
            instance.profit = profit
            instance.total_price = total_price
            instance.quantity = validated_data['quantity']
            instance.unit_price = validated_data['unit_price']
            instance.extracharges = validated_data['extracharges']
            instance.payment_type = validated_data['payment_type']
            
            

            # Update the Inventory table automatically
            product = InventoryProduct.objects.filter(
                hotel=hotel,
                product_id=related_product
            )
            if len(product) > 0:
            # The quantity will increase and the description will be "Product Refillment"
                product[0].quantity = product[0].quantity + validated_data['quantity'] - previous_quantity
                product[0].action = 'change'
                #product[0].action = 'change' ## Will add this later
                product[0].save()
                
            instance.save()   
            return instance
        
        else:
            reselling_price = VariantDetails.objects.get(hotel=hotel, variant_id=instance.variant.variant_id).price
            profit = (reselling_price - validated_data['unit_price']) * validated_data['quantity']
            total_price = validated_data['unit_price'] * validated_data['quantity']
            previous_quantity = instance.quantity
            
            print("PREVIOUS_QUANTITY", previous_quantity)
            instance.profit = profit
            instance.total_price = total_price
            instance.quantity = validated_data['quantity']
            instance.unit_price = validated_data['unit_price']
            instance.extracharges = validated_data['extracharges']
            instance.payment_type = validated_data['payment_type']
            
            
            # Update the Inventory table automatically
            product = InventoryProduct.objects.filter(
                        variant=instance.variant.variant_id,
                        hotel=hotel, 
                        product_id=related_product.id
                    )
            # The quantity will increase and the description will be "Product Refillment"
            if len(product) > 0:
                product[0].quantity = product[0].quantity + validated_data['quantity'] - previous_quantity
                product[0].action = 'change'
                #product[0].action = 'change' ## Will add this later
                product[0].save()
            instance.save()
            return instance
            



#---------------------------------------------------------------------------------------------------#
#                                             Salary Serializer                                     #
#---------------------------------------------------------------------------------------------------#
class SalarySerializer(serializers.ModelSerializer):
    
    employee_info = HotelUserForSalary_Serializer(source='employee', read_only=True)
    payment_info = PaymentInfoSerializer(source='payment_type', read_only=True)

    class Meta:
        model = Salary
        fields = [
            'hotel',
            'id',
            'salary',
            'employee',
            'employee_info',
            'payment_type',
            'payment_info',
            'created_at',
        ]
        
    lookup_field = 'id'
    

#---------------------------------------------------------------------------------------------------#
#                                             Rent Serializer                                       #
#---------------------------------------------------------------------------------------------------#
class RentSerializer(serializers.ModelSerializer):
    payment_info = PaymentInfoSerializer(source='payment_type', read_only=True)
    class Meta:
        model = Rent
        fields = '__all__'
        
    lookup_field = 'id'

#---------------------------------------------------------------------------------------------------#
#                                             Ebill Serializer                                      #
#---------------------------------------------------------------------------------------------------#
class EbillSerializer(serializers.ModelSerializer):
    payment_info = PaymentInfoSerializer(source='payment_type', read_only=True)
    class Meta:
        model = Ebill
        fields = '__all__'
        
    lookup_field = 'id'