from rest_framework import serializers
from .models import InventoryProduct, InventoryProductAudit, Notification, KitchenItemRequests
from hotel.serializers import HotelUserForSalary_Serializer
from sales.serializers import ItemsCategorySerializer, ProductSerializer_For_Inventory
from hotel.models import HotelUser
from sales.models import Product, ItemCategory, TaxGroup, VariantDetails
from django.contrib.auth import get_user_model
User=get_user_model()


from datetime import datetime
from django.utils import timezone

class InventoryProductSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    variant_name = serializers.CharField(source='variant.variant_value', read_only=True)
    product_id = serializers.CharField(source='product_id.id', read_only=True)
    product_info = serializers.SerializerMethodField()
   
    class Meta:
        model = InventoryProduct
        fields = [
            'id',
            'hotel',
            'user',
            'user_info',
            'product_id',
            'variant',
            'variant_name',
            'product_info',
            'quantity',
            'action',
            'expiry_date',
            'created_at'
        ]
        
    lookup_field = 'id'

    def get_user_info(self, obj):
        return {
            'email' : obj.user.email,
            'first_name' : obj.user.first_name,
            'last_name' : obj.user.last_name,
        }
    
    def get_product_info(self, obj):
        return {
            'name' : obj.product_id.name,
            'item_category_id' : obj.product_id.item_category_id_id,
            'tax_group_id' : obj.product_id.tax_group_id_id,
        }
        

class InventoryAuditProductSerializer(serializers.ModelSerializer):
    old_data = serializers.SerializerMethodField()
    new_data = serializers.SerializerMethodField()
    class Meta:
        model = InventoryProductAudit
        fields = [
            'hotel',
            'inventory_product',
            'action',
            'action_by',
            'description',
            'old_data',
            'new_data',
            'deleted_at',
            'timestamp'
        ]
        
        
    def user_details(self, user_id):
        return User.objects.filter(id=user_id).values('id', 'email', 'first_name', 'last_name')
    

    def get_old_data(self, obj):
        if obj.old_data == None:
            return obj.old_data
        else:
            hotel_user = obj.old_data['user']
        
            hotel_user_details = dict(list(HotelUser.objects.filter(hotel_id=obj.old_data['hotel'], user=User.objects.get(id=hotel_user).id).values(
                "user", "mobile_number"))[0])
            user = self.user_details(hotel_user_details['user'])
            hotel_user_details.pop('user')
            hotel_user_details = {**dict(user[0]), **hotel_user_details}
            
            
            product_id = dict(Product.objects.filter(hotel_id=obj.old_data['hotel'], id=obj.old_data['product_id']).values(
                'id', 'hotel_id', 'name', 'net_price', 'item_category_id', 'tax_group_id')[0])
            
            category = ItemCategory.objects.get(hotel_id = obj.old_data['hotel'], item_category_id=product_id['item_category_id']).item_category_name
            tax = TaxGroup.objects.get(hotel_id = obj.old_data['hotel'], tax_group_id=product_id['tax_group_id']).tax_group_name
            
            # Check if a product has a variant or not. If yes then populate its details along with its details.
            variant = obj.old_data.get('variant', None)
            variant_details = {}
            if variant != None:
                variant_details = dict(list(VariantDetails.objects.filter(hotel=obj.old_data['hotel'], variant_id=variant).values(
                    'variant_id', 'variant_value', 'price', 'variant_desc'
                ))[0])
            product_details = {**product_id, **variant_details, **{'category_name' : category}, **{'tax_name': tax}}
            
            obj.old_data['user'] = hotel_user_details
            obj.old_data['product_id'] = product_details
            # obj.old_data['variant'] = variant_details
            return obj.old_data
        
    def get_new_data(self, obj):
        if obj.new_data == None:
            return obj.new_data
        else:
            hotel_user = obj.new_data['user']
            hotel_user_details = dict(list(HotelUser.objects.filter(user=User.objects.get(id=hotel_user).id).values("user", "mobile_number"))[0])
            user = self.user_details(hotel_user_details['user'])
            hotel_user_details.pop('user')
            hotel_user_details = {**dict(user[0]), **hotel_user_details}

            product_id = dict(Product.objects.filter(hotel_id=obj.new_data['hotel'], id=obj.new_data['product_id']).values(
                'id', 'hotel_id', 'name', 'net_price', 'item_category_id', 'tax_group_id')[0])
            
            category = ItemCategory.objects.get(hotel_id = obj.new_data['hotel'], item_category_id=product_id['item_category_id']).item_category_name
            print(product_id)
            tax = TaxGroup.objects.get(hotel_id = obj.new_data['hotel'], tax_group_id=product_id['tax_group_id']).tax_group_name
            
            
            variant = obj.new_data.get('variant', None)
            variant_details = {}
            if variant != None:
                variant_details = dict(list(VariantDetails.objects.filter(hotel=obj.new_data['hotel'], variant_id=variant).values(
                    'variant_id', 'variant_value', 'price','variant_desc'
                ))[0])
                
            product_details = {**product_id, **variant_details, **{'category_name' : category}, **{'tax_name': tax}}

            obj.new_data['user'] = hotel_user_details
            obj.new_data['product_id'] = product_details
            return obj.new_data
        
    lookup_field = 'id'
    
    
    
class NotificationSerializer(serializers.ModelSerializer):
    expiry_date = serializers.CharField(source='product.expiry_date', read_only=True)
    product_details = serializers.SerializerMethodField(read_only=True)
    hotel_name = serializers.CharField(source='hotel', read_only=True)
    class Meta:
        model = Notification
        fields = "__all__"
        list_serializer_class = serializers.ListSerializer
        
    def create(self, validated_data):
        # Handle creating multiple instances
        if isinstance(validated_data, list):
            return [self.Meta.model.objects.create(**item) for item in validated_data]
        else:
            return super().create(validated_data)


    def get_product_details(self, obj):
        if obj.product == None:
            return None
        else:
            variant = obj.product.variant
            product = obj.product.product_id
            if variant == None:
                return {
                    'name' : product.name
                    }
            else:
                return {
                    'name' : product.name,
                    'variant' : variant.variant_value
                }


class OutletsNotificationSerializer(serializers.ModelSerializer):
    outlets_requests = serializers.SerializerMethodField()
    holte_name = serializers.CharField(source='hotel.hotel_name', read_only=True)
    class Meta:
        model = Notification
        fields = [
            'hotel',
            'holte_name',
            'outlets_requests'
            ]

class KitchenRequestsSerializer(serializers.ModelSerializer):
    request_details = NotificationSerializer(source='notification', read_only=True)
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    class Meta:
        model = KitchenItemRequests
        fields = "__all__"
        
    # def update(self, instance, validated_data):
    #     instance.status = validated_data['status']
    #     if instance.status == 'delivered':
    #         notification = instance.notification
    #         notification.status = 'resolved'
    #         notification.save()
    #     instance.save()
        
    #     return instance
            
    def update(self, instance, validated_data):
        if validated_data['status'] == "accepted":
            instance.status = validated_data['status']
            instance.accepted_at = timezone.now()
            instance.save()
        
        if validated_data['status'] == "ready":
            instance.status = validated_data['status']
            instance.ready_at = timezone.now()
            instance.save()

        if validated_data['status'] == "delivered":
            instance.status = validated_data['status']
            # if instance.status == 'delivered':
            #     notification = instance.notification
            #     notification.status = 'resolved'
            #     notification.resolved_at = timezone.now()
            #     notification.save()
        
            instance.delivered_at = timezone.now()
            instance.save()
                    
            
        
        if validated_data['status'] == 'rejected':
            instance.status = validated_data['status']
            # if instance.status == 'rejected':
            #     notification = instance.notification
            #     notification.status = 'resolved'
            #     notification.resolved_at = timezone.now()
            #     notification.save()
                
            instance.rejected_at = timezone.now()
            instance.save()
            
        return instance


class UpdateNotificationSerializer(serializers.ModelSerializer):
    expiry_date = serializers.CharField(source='product.expiry_date', read_only=True)
    product_details = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Notification
        fields = '__all__'
        extra_kwargs = {
            'action': {'read_only': True},
        }
        

    def validate(self, data):
            action = self.initial_data.get('action', None)
            if action is None:
                pass
            else:
                id = self.initial_data.get('id', None)
                if id is None:
                    pass
                else:
                    product = Notification.objects.get(hotel=self.initial_data['hotel'], id=id).product
                    if action['value'] == "change expiry date":
                        product.expiry_date = datetime.strptime(action['expiry_date'], '%Y-%m-%d').date()
                        product.action = 'date changed'
                        product.save()
                    elif action['value'] == "dispose":
                        product.action = 'dispose'
                        print('before dispose', product.quantity)
                        product.quantity = 0
                        product.save()
                    
            return data
        
        
        
    def update(self, instance, validated_data):
        request = validated_data.get('request', None)
        status = validated_data.get('status', None)
        uom = validated_data.get('uom', None)
        quantity = validated_data.get('quantity', None)
        
        if request : instance.request = validated_data['request']
        if status : instance.status = validated_data['status']
        if uom : instance.uom = validated_data['uom']
        if quantity : instance.quantity = validated_data['quantity']
        
        if status == 'in progress':
            instance.in_progress_at = timezone.now()
        if status == "resolved":
            instance.resolved_at = timezone.now()
        instance.save()

        if instance.status == "in progress":
            
            if instance.hotel.parent == None:
                
                KitchenItemRequests.objects.create(
                    hotel_id = instance.hotel,
                    notification = instance,
                )
            else:
                KitchenItemRequests.objects.create(
                hotel_id = instance.hotel.parent,
                notification = instance,
            )
            

        return instance
        
    def get_product_details(self, obj):
        if obj.product == None:
            return None
        else:
            variant = obj.product.variant
            product = obj.product.product_id
            if variant == None:
                return {
                    'name' : product.name
                    }
            else:
                return {
                    'name' : product.name,
                    'variant' : variant.variant_value
                }

