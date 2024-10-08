# Generated by Django 4.1.6 on 2023-05-04 23:23

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('hotel', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AddOnDetails',
            fields=[
                ('add_on_id', models.AutoField(editable=False, primary_key=True, serialize=False, unique=True)),
                ('add_on_value', models.CharField(max_length=100)),
                ('price', models.PositiveBigIntegerField()),
                ('add_on_desc', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('hotel', 'add_on_id')},
            },
        ),
        migrations.CreateModel(
            name='Bill',
            fields=[
                ('bill_id', models.AutoField(editable=False, primary_key=True, serialize=False, unique=True)),
                ('bill_status', models.CharField(choices=[('paid', 'Paid'), ('unpaid', 'Unpaid')], max_length=200)),
                ('refund_amount', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('cash_recieved', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('discount_type', models.CharField(blank=True, choices=[('percent', 'Percent'), ('amount', 'Amount')], max_length=100, null=True)),
                ('discount_value', models.FloatField(blank=True, default=0, null=True)),
                ('total_amount', models.FloatField(blank=True, default=0, null=True)),
                ('round_off_amount', models.FloatField(blank=True, default=0, null=True)),
                ('discount_amount', models.FloatField(blank=True, default=0, null=True)),
                ('net_amount', models.FloatField(blank=True, default=0, null=True)),
                ('cash_balance', models.FloatField(blank=True, default=0, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Customers',
            fields=[
                ('customer_id', models.AutoField(editable=False, primary_key=True, serialize=False, unique=True)),
                ('customer_name', models.CharField(max_length=100)),
                ('customer_mobile', models.PositiveBigIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('hotel_id', 'customer_id', 'customer_mobile')},
            },
        ),
        migrations.CreateModel(
            name='HotelTableStatus',
            fields=[
                ('table_id', models.AutoField(editable=False, primary_key=True, serialize=False, unique=True)),
                ('status', models.CharField(choices=[('occupied', 'Occupied'), ('free', 'Free')], max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('number', models.IntegerField(blank=True, null=True)),
                ('customer_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales.customers')),
                ('hotel_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
        ),
        migrations.CreateModel(
            name='ItemCategory',
            fields=[
                ('item_category_id', models.AutoField(editable=False, primary_key=True, serialize=False, unique=True)),
                ('item_category_name', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
            options={
                'unique_together': {('hotel_id', 'item_category_id', 'item_category_name')},
            },
        ),
        migrations.CreateModel(
            name='ItemOrdered',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(blank=True, choices=[('created', 'Created'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('ready', 'Ready'), ('delivered', 'Delivered')], default='sent', max_length=50, null=True)),
                ('type', models.CharField(blank=True, choices=[('table order', 'Talbe Order'), ('takeaway', 'TakeAway')], default='table order', max_length=50, null=True)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('item_remarks', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('accepted_at', models.DateTimeField(blank=True, null=True)),
                ('rejected_at', models.DateTimeField(blank=True, null=True)),
                ('ready_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('addon', models.ManyToManyField(blank=True, to='sales.addondetails')),
                ('bill_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sales.bill')),
                ('hotel_id', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
        ),
        migrations.CreateModel(
            name='VariantDetails',
            fields=[
                ('variant_id', models.AutoField(editable=False, primary_key=True, serialize=False, unique=True)),
                ('variant_value', models.CharField(max_length=100)),
                ('price', models.PositiveBigIntegerField()),
                ('variant_desc', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('hotel', 'variant_id')},
            },
        ),
        migrations.CreateModel(
            name='TaxGroup',
            fields=[
                ('tax_group_id', models.AutoField(editable=False, primary_key=True, serialize=False, unique=True)),
                ('tax_group_name', models.CharField(max_length=100)),
                ('tax_value', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='TakeAway',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_status', models.CharField(choices=[('created', 'Created'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('ready', 'Ready'), ('delivered', 'Delivered')], max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('accepted_at', models.DateTimeField(blank=True, null=True)),
                ('rejected_at', models.DateTimeField(blank=True, null=True)),
                ('ready_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('bill_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sales.bill')),
                ('customer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sales.customers')),
                ('hotel_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
                ('order_id', models.ManyToManyField(blank=True, to='sales.itemordered')),
            ],
        ),
        migrations.CreateModel(
            name='TableOrder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_status', models.CharField(choices=[('created', 'Created'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('ready', 'Ready'), ('delivered', 'Delivered')], max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('accepted_at', models.DateTimeField(blank=True, null=True)),
                ('rejected_at', models.DateTimeField(blank=True, null=True)),
                ('ready_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('bill_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sales.bill')),
                ('hotel_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
                ('order_id', models.ManyToManyField(blank=True, to='sales.itemordered')),
                ('table_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sales.hoteltablestatus')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100)),
                ('unit_price', models.PositiveBigIntegerField(blank=True, default=0, null=True)),
                ('net_price', models.PositiveBigIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hotel', to='hotel.hoteldata')),
                ('item_category_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sales.itemcategory')),
                ('tax_group_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tax', to='sales.taxgroup')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('hotel_id', 'id')},
            },
        ),
        migrations.CreateModel(
            name='PaymentCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(choices=[('cash', 'Cash'), ('card', 'Card'), ('upi', 'UPI'), ('others', 'Others')], default='others', max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('hotel', 'name')},
            },
        ),
        migrations.CreateModel(
            name='ItemVariantAddOn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('hotel', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata')),
                ('item_add_on', models.ManyToManyField(blank=True, default=[], to='sales.addondetails')),
                ('item_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sales.product')),
                ('variant', models.ManyToManyField(blank=True, default=[], to='sales.variantdetails')),
            ],
        ),
        migrations.AddField(
            model_name='itemordered',
            name='products',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sales.product'),
        ),
        migrations.AddField(
            model_name='itemordered',
            name='variant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sales.variantdetails'),
        ),
        migrations.AddField(
            model_name='bill',
            name='customer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='sales.customers'),
        ),
        migrations.AddField(
            model_name='bill',
            name='hotel_id',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='hotel.hoteldata'),
        ),
        migrations.AddField(
            model_name='bill',
            name='payment_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sales.paymentcategory'),
        ),
    ]
