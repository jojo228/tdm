from collections import defaultdict
import json
import math

from django.core.exceptions import ValidationError
from django.db import transaction, connection
from django.db.models import Q, Func,Value, Sum
from django.utils import timezone
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from hotel.models import HotelData
from inventory.models import InventoryProduct

from .models import (
    AddOnDetails,
    Bill,
    Customers,
    HotelTableStatus,
    ItemCategory,
    ItemOrdered,
    ItemVariantAddOn,
    PaymentCategory,
    Product,
    TableOrder,
    TakeAway,
    TaxGroup,
    VariantDetails,
)


def ValueTuple(items):
    return tuple(Value(i) for i in items)

class Tuple(Func):
    function = ''


class VariantDetailsSerializer(serializers.ModelSerializer):
    '''
        Model: VariantDetails
        Urls : 
            1-  items/variants/
    '''
   
    permission_classes = ['AllowAny', ]
    class Meta:
        model = VariantDetails
        fields = '__all__'
        lookup_fields = ['hotel_id']
        
class AddOnDetailsSerializer(serializers.ModelSerializer):
    '''
        Model: AddOnDetails
        Urls : 
            1-  items/add_on/
    '''
    permission_classes = ['AllowAny',]
    class Meta:
        model = AddOnDetails        
        fields = '__all__'

class ItemsSerializer(serializers.ModelSerializer):
    '''
        Model: Product
        Urls : 
            1- items/
            2- items/<int:pk>/
            3- 
    '''
    
    url = serializers.HyperlinkedIdentityField(
        view_name='item-detail',
        lookup_field = 'pk',
        read_only=True
    )
    item_category_name = serializers.CharField(source='item_category_id.item_category_name', read_only=True)
    tax_group_name = serializers.CharField(source='tax_group_id.tax_group_name', read_only=True)
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    quantity = serializers.SerializerMethodField(read_only=True)
    variant_details = serializers.SerializerMethodField()
    addons_details = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'hotel_name',
            'id',
            'url',
            'name',
            'unit_price',
            'net_price',
            'quantity',
            'item_category_name',
            'item_category_id',
            'tax_group_name',
            'variant_details',
            'addons_details',
            'created_at'
        ]
        lookup_field = 'id'

    def get_quantity(self, obj):        
        inventory_result = obj.inventoryproduct_set.all() # Cached result - Already fetched using prefetch_related

        quantity = []
        for inventory in inventory_result:
            v_id = inventory.variant_id

            if v_id is None:
                v_id = 'product'

            quantity.append({
                'variant_id': v_id,
                'quantity': inventory.quantity
            })

        return quantity
    
    def get_variant_details(self, obj):
        itemvariantaddons = obj.itemvariantaddon_set.all() # Cached result - Already fetched using prefetch_related

        variants = []

        for itemvariantaddon in itemvariantaddons:
            for variant in itemvariantaddon.variant.all(): # Cached result - Already fetched using prefetch_related
                variants.append({
                    'variant_id': variant.variant_id,
                    'variant_value': variant.variant_value,
                    'price': variant.price,
                    'variant_desc': variant.variant_desc
                })

        return variants
    
    def get_addons_details(self, obj):
        itemvariantaddons = obj.itemvariantaddon_set.all() # Cached result - Already fetched using prefetch_related

        addons = []

        for itemvariantaddon in itemvariantaddons:
            for addon in itemvariantaddon.item_add_on.all(): # Cached result - Already fetched using prefetch_related
                addons.append({
                    'add_on_id': addon.add_on_id,
                    'add_on_value': addon.add_on_value,
                    'price': addon.price,
                    'add_on_desc': addon.add_on_desc
                })

        return addons

class ItemsCategorySerializer(serializers.ModelSerializer):
    '''
        Model: Product
        Urls : 
            1- item_category/
    '''
    item_category_name = serializers.CharField(source='item_category_id.item_category_name', read_only=True)
    tax_group_name = serializers.CharField(source='tax_group_id.tax_group_name', read_only=True)
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    quantity = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = [
            'hotel_id',
            'hotel_name',
            'name',
            'quantity',
            'item_category_id',
            'item_category_name',
            'tax_group_name',
            
        ]

    def get_quantity(self, obj):
        vs=obj.itemvariantaddon_set.values('variant')
        if len(obj.itemvariantaddon_set.values('variant')) == 0 or dict(vs[0])['variant']==None:
            item = obj.inventoryproduct_set.values('quantity')
            if len(item) > 0:
                return sum(ele['quantity'] for ele in item)
            else:
                return None
        else:
            quantity = {}
            variants = obj.itemvariantaddon_set.values('variant')
            for variant_id in list(variants):
                
                variant = VariantDetails.objects.get(hotel=obj.hotel_id, variant_id=variant_id['variant'])
                
                q = InventoryProduct.objects.filter(
                    hotel=obj.hotel_id, 
                    product_id=obj.id, 
                    variant=variant_id['variant']
                ).values('quantity')
                
                if len(q) > 0:
                    details = dict(list(q)[0])
                    details['name'] = variant.variant_value
                    details['variant_id'] = variant_id['variant']
                    quantity[variant_id['variant']] = details              

            return quantity
        
class CategorySerializer(serializers.ModelSerializer):
    '''
        Model: Product
        Urls : 
            1- hotel/item_category/
    '''
    
    class Meta:
        model = ItemCategory 
        fields = [
            'hotel_id',
            'item_category_id',
            'item_category_name',
            'created_at'
        ]   
        
    
class ItemsCreateSerializer(serializers.ModelSerializer):
    '''
        Model: Product
        Urls : 
            1- add_item/
    '''
    class Meta:
        model = Product
        fields = '__all__'
        
        
class ProductSerializer_For_Inventory(serializers.ModelSerializer):
    '''
        Model: Product
        Urls : 
            1- inventory/<int:pk>/
    '''
    item_category_name = serializers.CharField(source='item_category_id.item_category_name', read_only=True)
    tax_group_name = serializers.CharField(source='tax_group_id.tax_group_name', read_only=True)
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'hotel_id',
            'hotel_name',
            'name',
            'item_category_id',
            'item_category_name',
            'tax_group_name'
        ]

        
class ProductSerializer(serializers.ModelSerializer):
    '''
        Model: Product
        Urls : 
            1- items/update/<int:pk>/
    '''
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'unit_price',
            'net_price',
            'hotel_id',
            'item_category_id',
            'tax_group_id'
        ]     
        lookup_field = 'id'
        
        def update(self, instance, validated_data):
            instance.net_price = instance.unit_price + (instance.unit_price * instance.tax_group_id.tax_value) / 100
            instance.save()
            return instance
    
        
class CustomersSerializer(serializers.ModelSerializer):
    '''
        Model: Customers
        Urls : 
            1- customers/
            2- customers/?hotel=1&mobile=123
    '''
    permission_classes = ['AllorwAny',]
    class Meta:
        model = Customers
        fields = '__all__'
        
    # validators = [
    #         UniqueTogetherValidator(
    #             queryset=Customers.objects.all(),
    #             fields=['hotel_id', 'customer_name', 'customer_mobile']
    #         )
    #     ]
        
        
        
class BillSerializer(serializers.ModelSerializer):
    '''
        Model: Bill
        Urls : 
            1- all_receipts/
            2- receipts/print/<str:pk>/
            3- receipts/
            4- order_ticket/
    '''
    permission_classes = ['AllowAny']
    products = serializers.Serializer(read_only=True)
    payment_name = serializers.CharField(source='payment_type', read_only=True)
    customer = CustomersSerializer(many=False, required=False)
    class Meta:
        model = Bill
        
        fields = [
            'hotel_id',
            'bill_id',
            'customer',
            'products',
            'bill_status',
            'discount_type',
            'discount_value',
            'round_off_amount',
            'total_amount',
            'discount_amount',
            'net_amount',
            'refund_amount',
            'cash_recieved',
            'cash_balance',
            'payment_type',
            'payment_name',
            'created_at', 
        ]
        
    
    def discount_amount(self, discount_type, total_amount, discount_value):
        if discount_type == 'percent':
            return (total_amount) * float(discount_value)/100.0
    
        elif discount_type == 'amount':
            return discount_value
        else: 
            return 0

        

    def net_amount(self, total_amount, discount_amount, refund_amount):
        if refund_amount == 0 and discount_amount == 0:
            return math.floor(total_amount)
        elif discount_amount != 0 and refund_amount == 0:
            return math.floor(total_amount - discount_amount)
        elif discount_amount == 0 and refund_amount != 0:
            return math.floor(total_amount - refund_amount)
        elif discount_amount !=0  and refund_amount != 0:
            return math.floor(total_amount - discount_amount - refund_amount)
        else: 
            return 0

            
    def cash_balance(self, cash_recieved=0, net_amount=0):
        if cash_recieved != 0:
            return (cash_recieved - net_amount)
        else:
            return 0
    
    def update(self, instance, validated_data):
        orders = instance.itemordered_set.all()
        database = {}
        products = []
        addons = []
        variants = []
        bill = Bill.objects.get(bill_id=instance.bill_id)
        orders = bill.itemordered_set.all()
        addon_price = 0
        variant_price = 0
        products_price = 0
        total_amount = 0
        for order in orders:
            if order.status != "rejected":
                addon_ids = order.addon.all().values_list('add_on_id', flat=True)
                if len(addon_ids) > 0:
                    for ele in addon_ids:
                        single_addon = dict(*AddOnDetails.objects.filter(hotel=instance.hotel_id, add_on_id=ele)
                                        .values('hotel', 'add_on_value', 'price'))
                        addons.append(single_addon)     
                        addon_price += single_addon['price']   
                        
                if order.variant is not None:
                    single_variant = dict(*VariantDetails.objects.filter(hotel=instance.hotel_id,variant_value=order.variant)
                                            .values('hotel', 'variant_value', 'price'))
                    single_variant["item"] = order.products.name
                    single_variant["quantity"] = order.quantity
                    
                    variants.append(single_variant)
                    variant_price += single_variant['price'] * single_variant['quantity']
                        
                        
                product = dict(*Product.objects.filter(id=order.products.id)
                                    .values('id', 'hotel_id_id', 'name', 
                                            'unit_price', 'net_price',
                                            'item_category_id', 'tax_group_id'))
                product['quantity'] = order.quantity
                products.append(product)    
                products_price += sum([product['net_price'] * product['quantity']])
        
        database['products'] = products
        database['variants'] = variants
        database['addons'] = addons
        database['total_price'] = products_price + addon_price + variant_price
        
        total_amount = database['total_price']
        
        discount_amount = self.discount_amount(
            validated_data['discount_type'], 
            total_amount, 
            validated_data['discount_value'],
            
            )
        
        
        net_amount = self.net_amount(
            total_amount,
            discount_amount,
            validated_data.get('refund_amount', 0)
        )
        
        cash_balance = self.cash_balance(
            cash_recieved = validated_data.get('cash_recieved', 0),
            net_amount = net_amount
        )
        
        payment = validated_data.get('payment_type', None)
        
        table_bill = instance.tableorder_set.all()
        
        

        if len(table_bill) > 0:
            if table_bill[0].order_status == "delivered" :
                
                instance.discount_type = validated_data['discount_type']
                    
                instance.discount_value = validated_data['discount_value']
                
                instance.discount_amount = discount_amount
                
                instance.total_amount = total_amount
                
                instance.refund_amount = validated_data.get('refund_amount', 0)
                
                instance.cash_recieved = validated_data.get('cash_recieved', 0)
                
                instance.round_off_amount = math.floor(total_amount)

                instance.net_amount = net_amount

                instance.cash_balance = cash_balance
                
                # if payment is None:
                #     raise serializers.ValidationError("Plase select a payment type")
                # else:
                #     instance.payment_type = payment
                    
                instance.bill_status = validated_data.get('bill_status')
                instance.payment_type = payment
                instance.save()
            else:
                raise serializers.ValidationError("This order must have status as delivered be applying any payment")

        
        takeaway_bill = instance.takeaway_set.all()
        
        if len(takeaway_bill) > 0:
            if takeaway_bill[0].order_status == "delivered":
                print(takeaway_bill[0].order_status)
                instance.discount_type = validated_data['discount_type']
                    
                instance.discount_value = validated_data['discount_value']
                
                instance.discount_amount = discount_amount
                
                instance.total_amount = total_amount
                
                instance.refund_amount = validated_data.get('refund_amount', 0)
                
                instance.cash_recieved = validated_data.get('cash_recieved', 0)
                
                instance.round_off_amount = math.floor(total_amount)

                instance.net_amount = net_amount

                instance.cash_balance = cash_balance
                
                instance.bill_status = validated_data.get('bill_status')
                
                
                # if payment is None:
                #     raise serializers.ValidationError("Plase select a payment type")
                # else:
                #     instance.payment_type = payment
                instance.payment_type = payment
                instance.save()
                
            else:
                raise serializers.ValidationError("This order must have status as delivered be applying any payment")


        return instance
        
class HotelTableStatusSerializer(serializers.ModelSerializer):
    '''
        Model: HotelTableStatus
        Urls : 
            1- table_status/
            2- create_table/
            3- table_update/<int:pk>/
    '''
    permission_classes = ['AllowAny', ]
    class Meta:
        model = HotelTableStatus
        fields = '__all__'
        
        list_serializer_class = serializers.ListSerializer
        
    
    def create(self, validated_data):
        if isinstance(validated_data, list):
            return [self.Meta.model.objects.create(**item) for item in validated_data]
        else:
            return super().create(validated_data)
        
class OrderDetailsSerializer(serializers.ModelSerializer):
    '''
        Model: ItemOrdered
        Urls : 
            1- order_ticket/
    '''
    permission_classes = ['AllowAny']
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    table_id = serializers.IntegerField(write_only=True)
    products = serializers.ListField(write_only=True)
    # New lines added
    addon = serializers.CharField(read_only=True)
    variant = serializers.CharField(read_only=True)
    
    
    class Meta:
        model = ItemOrdered
        fields = [
            'hotel_id',
            'hotel_name',
            'id',
            'bill_id',
            'table_id',
            'type',
            'status',
            'products',
            'quantity',
            'addon',
            'variant',
            ]
        
        # addon and variant added to extra_kwargs
        
        extra_kwargs = {
            'bill_id': {'required': False},
            'addon': {'required': False},
            'variant': {'required': False},
            } 
    
    @transaction.atomic
    def create(self, validated_data):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        validate = validated_data

        hotel = validated_data["hotel_id"]
        order_type: str = validated_data["type"]
        table_id: int = validated_data["table_id"]

        existing_order = (
            TableOrder.objects.filter(
                hotel_id=hotel, table_id=table_id, bill_id__bill_status="unpaid"
            )
            .select_related("bill_id")
            .last()
        )

        if existing_order:
            bill = existing_order.bill_id
        else:
            bill = Bill.objects.create(hotel_id=hotel, bill_status="unpaid")

        products = validated_data.pop("products")

        product_ids_without_variant = []
        product_id_variant_id = []

        required_quantity_map = defaultdict(int)
        orders = []

        for item in products:
            product_id = item.get("product", None)
            if product_id is None:
                raise serializers.ValidationError("Product is required")

            variant_id = item.get("variant", None)
            if variant_id is None:
                product_ids_without_variant.append(product_id)
            else:
                product_id_variant_id.append((product_id, variant_id))

            required_quantity = item.get("quantity", 1)

            required_quantity_map[(product_id, variant_id)] += required_quantity

            item_order = ItemOrdered(
                hotel_id=hotel,
                bill_id=bill,
                type=order_type,
                quantity=required_quantity,
                products_id=product_id,
                variant_id=variant_id,
                item_remarks=item.get("item_remarks", ""),
            )

            orders.append(item_order)

        inventories = (
            InventoryProduct.objects.alias(product_variant=Tuple("product_id", "variant"))
            .select_related("product_id")
            .select_for_update()
            .filter(
                Q(product_variant__in=ValueTuple(product_id_variant_id))
                | Q(product_id__in=product_ids_without_variant),
                hotel=hotel,
            )
        )

        inventory_updates = []

        for inventory in inventories:
            product_id = inventory.product_id_id
            variant_id = inventory.variant_id
            total_quantity = inventory.quantity

            required_quantity = required_quantity_map[(product_id, variant_id)]

            if total_quantity < required_quantity:
                raise serializers.ValidationError(
                    "Required quantity is unsufficient for product {}".format(
                        inventory["product_id__name"]
                    )
                )

            inventory.action = "sales"
            inventory.user = user
            inventory.quantity = total_quantity - required_quantity

            inventory_updates.append(inventory)

        InventoryProduct.objects.bulk_update(inventory_updates, ["quantity", "user", "action"])

        created_order_ids = []

        for order in orders:
            order.save()
            created_order_ids.append(order.id)

        status = "delivered" if not hotel.kitchenservices.enabled else "created"
        if order_type == "table order":
            table_order = TableOrder.objects.create(
                hotel_id=hotel, table_id_id=table_id, bill_id=bill, order_status=status
            )
            table_order.order_id.set(created_order_ids)
        elif order_type == "takeaway":
            takeaway_order = TakeAway.objects.create(
                hotel_id=hotel, bill_id=bill, order_status=status
            )
            takeaway_order.order_id.set(created_order_ids)

        validate["bill_id"] = bill

        # print(
        #     "Number of SQL Queries: ", len(connection.queries)
        # )

        # Open a file and write all sql statements 
        # total_sql_time=0
        # with open('sql.txt', 'w+') as f:
        #     for query in connection.queries:
        #         f.write(query['time'] + " " + query['sql'] + "\n")
        #         total_sql_time += float(query['time'])
        #     f.write("Total SQL time: " + str(total_sql_time) + "\n")

        return validate
        
        
class ItemAddOnSerializer(serializers.ModelSerializer):
    
    permission_classes = ['AllowAny']
    class Meta:
        model = Product
        fields = [
            'id',
            'name'
            ]
        
class ItemVariantAddOnSerializer(serializers.ModelSerializer):
    '''
        Model: ItemVariantAddOn
        Urls : 
            1-  items/variants/add_on/
    '''
    permission_classes = ['AllowAny',]
    variant_details = VariantDetailsSerializer(many=True, source='variant', read_only=True)
    item = ItemAddOnSerializer(many=False, source='item_id', read_only=True)
    add_on_details = AddOnDetailsSerializer(many=True, source='item_add_on', read_only=True)
    class Meta:
        model = ItemVariantAddOn
        fields = [
            'id',
            'hotel',
            'item_id',
            'item',
            'variant',
            'variant_details',
            'item_add_on',
            'add_on_details'
        ]
        lookup_fields = ['hotel_id']
        extra_kwargs = {
            'item_add_on': {'required': False},
            'variant': {'required': False},
            } 

        validators = [
            UniqueTogetherValidator(
                queryset=ItemVariantAddOn.objects.all(),
                fields=['hotel', 'item_id']
            )
        ]

class TaxGroupSerializer(serializers.ModelSerializer):
    '''
        Model: TaxGroup
        Urls : 
            1-  tax_groups/
            2- add_tax/
            3- tax_update/<int:pk>/
    '''
    permission_classes = ['AllowAny',]
    class Meta:
        model = TaxGroup
        fields = '__all__'
        
        
class PaymentCategorySerializer(serializers.ModelSerializer):
    '''
        Model: TaxGroup
        Urls : 
            1- add_payment_types/
            2- get_payment_types/
    '''  
    permission_classes = ['AllowAny',]
    class Meta:
        model = PaymentCategory
        fields = '__all__'
        
#------------------------------------------------------------------------------------#
#                 This is serializer will be used in Expense Tracking                #
#------------------------------------------------------------------------------------#

class PaymentInfoSerializer(serializers.ModelSerializer):
    permission_classes = ['AllowAny',]
    class Meta:
        model = PaymentCategory
        fields = [
            'hotel',
            'id',
            'name'
        ]
    

class HotelOrderSerializer(serializers.ModelSerializer):
    '''
    '''
    permission_classes = ['AllowAny']
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    products = ItemsCreateSerializer(many=False)
    
    # New lines added
    addon = AddOnDetailsSerializer(many=True)
    variant = VariantDetailsSerializer(many=False)
    
    
    class Meta:
        model = ItemOrdered
        fields = [
            'hotel_id',
            'hotel_name',
            'id',
            'bill_id',
            'type',
            'status',
            'products',
            'quantity',
            'addon',
            'variant',
            'created_at',
            'accepted_at',
            'rejected_at',
            'ready_at',
            'delivered_at'
            ]
        
        # addon and variant added to extra_kwargs
        
        extra_kwargs = {
            'bill_id': {'required': False},
            'addon': {'required': False},
            'variant': {'required': False},
            } 
        
        
class HotelTableOrdersSerializer(serializers.ModelSerializer):
    '''
    '''
    
    permission_classes = ['AllowAny']
    orders = serializers.SerializerMethodField(read_only=True)
    # details = OrderDetailsSerializer(source=orders)
    class Meta:
        model = HotelTableStatus
        fields = [
            'hotel_id',
            'table_id',
            'number',
            'status',
            'customer_id',
            'orders',
        ]
        
        lookup_field = 'table_id'
        
    def get_orders(self,obj):
        bill = TableOrder.objects.filter(hotel_id=obj.hotel_id, table_id=obj.table_id).last()
        if bill:
            qs = HotelOrderSerializer(ItemOrdered.objects.filter(hotel_id=obj.hotel_id, bill_id=bill.bill_id), many=True).data
            return qs    
        else:
            return None
    
#------------------------------------------------------------------------------------------------------#
#                           Serializer used to retrieve receipt using bill id                          #
#                                            URL : receipt/?hotel=1&bill=1                             #
#------------------------------------------------------------------------------------------------------#

class OneBillSerializer(serializers.ModelSerializer):
    '''
        Model: Bill
        Urls : 
            1- receipt/?hotel=1&bill=1
    '''
    permission_classes = ['AllowAny']
    products = serializers.Serializer(read_only=True)
    payment_name = serializers.CharField(source='payment_type', read_only=True)
    customer = CustomersSerializer(many=False)
    class Meta:
        model = Bill
        fields = '__all__'
        
        
#------------------------------------------------------------------------------------------------------#
#                           Serializer used to create product from excel sheet                         #
#                                 URL : products/file_uploader/?hotel=1                                #
#------------------------------------------------------------------------------------------------------#

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    hotel = serializers.CharField()
class SaveFileSerializer(serializers.Serializer):
    class Meta:
        model = Product
        fields = "__all__"
        
        
class KitchenOrderDetailsSerializer(serializers.ModelSerializer):
    '''
        Model: ItemOrdered
        Urls : 
            1- order_ticket/
    '''
    permission_classes = ['AllowAny']
    products = serializers.CharField(source='products.name', read_only=True)
    
    # New lines added
    variant = serializers.CharField(read_only=True)
    addon_details = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = ItemOrdered
        fields = [
            'type',
            'status',
            'products',
            'quantity',
            'item_remarks',
            'addon',
            'addon_details',
            'variant',
            'created_at',
            'accepted_at',
            'rejected_at',
            'ready_at',
            'delivered_at'
            ]
        
    def get_addon_details(self, obj):
        if obj.addon is None:
            return None
        else:
            print(obj.addon.all())
            return [addon.add_on_value for addon in list(obj.addon.all())]


class TableOrderSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    order_details = KitchenOrderDetailsSerializer(source='order_id', many=True, read_only=True)
    table_details = serializers.SerializerMethodField(read_only=True)
    
    lookup_fields = 'id'
   
    class Meta:
        model = TableOrder 
        fields = [
            'id',
            'hotel_id',
            'hotel_name',
            'order_status',
            'table_details',
            'order_id',
            'order_details',
            'bill_id',
            'created_at',
            'accepted_at',
            'rejected_at',
            'ready_at',
            'delivered_at'
        ]
        
    def get_table_details(self, obj):
        return [{'table_id':obj.table_id.table_id, 'number': obj.table_id.number, 'status' : obj.table_id.status}]
    
    
    def update(self, instance, validated_data):
        if validated_data['order_status'] == "accepted":
            instance.order_status = validated_data['order_status']
            orders = instance.order_id.all()
            for order in orders:
                if order.status == "sent":
                    order.status = "accepted"
                    order.accepted_at = timezone.now()
                    order.save()
                    
            instance.accepted_at = timezone.now()
            instance.save()
            
        if validated_data['order_status'] == "ready":
            instance.order_status = validated_data['order_status']
            orders = instance.order_id.all()
            for order in orders:
                if order.status == "rejected":
                    pass
                if order.status == "delivered":
                    pass
                if order.status == "accepted" or order.status== "sent":
                    order.status = "ready"
                    order.ready_at = timezone.now()
                    order.save()
            instance.ready_at = timezone.now()
            instance.save()

        if validated_data['order_status'] == "delivered":
            instance.order_status = validated_data['order_status']
            instance.delivered_at = timezone.now()
            orders = instance.order_id.all()
            for order in orders:
                if order.status != "rejected":
                    order.status = "delivered"
                    order.delivered_at = timezone.now()
                    order.save()
                    
            instance.delivered_at = timezone.now()
            instance.save()
                    
            
        
        if validated_data['order_status'] == 'rejected':
            instance.order_status = validated_data['order_status']
            table_status = instance.table_id
            table_status.status = 'free'
            table_status.customer_id = None
            table_status.save()
            
            instance.rejected_at = timezone.now()
            instance.save()
            
        if validated_data['order_status'] == 'rejected':
            bill = instance.bill_id
            bill.delete()
        return instance
    
    

class TakeAwaySerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel_id.hotel_name', read_only=True)
    order_details = KitchenOrderDetailsSerializer(source='order_id', many=True, read_only=True)
    # takeaway_details = serializers.SerializerMethodField(read_only=True)
    customer_details = CustomersSerializer(source='customer', read_only=True)
    
    lookup_fields = 'id'
   
    class Meta:
        model = TakeAway 
        fields = [
            'id',
            'hotel_id',
            'hotel_name',
            'order_status',
            'order_id',
            'order_details',
            'bill_id',
            'customer',
            'customer_details',
            'created_at',
            'accepted_at',
            'rejected_at',
            'ready_at',
            'delivered_at'
        ]
    
    def update(self, instance, validated_data):
        if validated_data['order_status'] == "accepted":
            instance.order_status = validated_data['order_status']
            orders = instance.order_id.all()
            for order in orders:
                if order.status == "sent":
                    order.status = "accepted"
                    order.accepted_at = timezone.now()
                    order.save()
                    
            instance.accepted_at = timezone.now()
            instance.save()
                    
        if validated_data['order_status'] == "ready":
            instance.order_status = validated_data['order_status']
            orders = instance.order_id.all()
            for order in orders:
                if order.status == "rejected":
                    pass
                if order.status == "delivered":
                    pass
                if order.status == "accepted" or order.status== "sent":
                    order.status = "ready"
                    order.ready_at = timezone.now()
                    order.save()
                    
            instance.ready_at = timezone.now()
            instance.save()
            
            
        if validated_data['order_status'] == "delivered":
            instance.order_status = validated_data['order_status']
            orders = instance.order_id.all()
            for order in orders:
                if order.status != "rejected":
                    order.status = "delivered"
                    order.delivered_at = timezone.now()
                    order.save()
            instance.delivered_at = timezone.now()
            instance.save()
        
        if validated_data['order_status'] == 'rejected':
            instance.order_status = validated_data['order_status']
            instance.rejected = timezone.now()
            instance.save()
            bill = instance.bill_id
            bill.delete()
        
        return instance


class HotelTakeAwayOrdersSerializer(serializers.ModelSerializer):
    permission_classes = ['AllowAny']
    orders = serializers.SerializerMethodField(read_only=True)
    # details = OrderDetailsSerializer(source=orders)
    class Meta:
        model = TakeAway
        fields = [
            "id",
            'hotel_id',
            'order_status',
            'customer',
            'orders',
        ]
        
        lookup_field = 'id'
        
    def get_orders(self,obj):
        bill = TakeAway.objects.filter(hotel_id=obj.hotel_id, id=obj.id)
        if bill:
            qs = HotelOrderSerializer(ItemOrdered.objects.filter(hotel_id=obj.hotel_id, bill_id=obj.bill_id), many=True).data
            return qs
        else:
            return None
    
    
class IndividualOrderedItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ItemOrdered
        fields = '__all__'
        extra_kwargs = {
            'bill_id': {'required': False},
            'addon': {'required': False},
            'variant': {'required': False},
            'products': {'required' : False}
            } 
        
        
    def update(self, instance, validated_data):
        status = validated_data.get('status', None)
        if status:
            if status == "accepted":
                instance.status = "accepted"
                instance.accepted_at = timezone.now()
                instance.save()
            elif status == "rejected":
                instance.status = "rejected"
                instance.rejected_at = timezone.now()
                instance.save()
            elif status == "ready" :
                instance.status = "ready"
                instance.ready_at = timezone.now()
                instance.save()
            elif status == "delivered":
                instance.status = "delivered"
                instance.delivered_at = timezone.now()
                instance.save()
            else:
                raise serializers.ValidationError("Item status must be in (sent, accepted, rejected, ready, delivered)")
        else:
            raise serializers.ValidationError("Item status must be provided")
        return instance