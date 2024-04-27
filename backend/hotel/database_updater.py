import pandas as pd
import numpy as np
from hotel.models import HotelData
from sales.models import ItemCategory, TaxGroup, VariantDetails, ItemVariantAddOn, Product


data = pd.read_csv(r"C:\\Users\\Ich07\\Downloads\\AArthi Sweets & Bakery - Sheet3.csv")

print(data.columns)
print(data.shape)
print(data.CATEGORY[0])

for category in data.CATEGORY.unique():
    ItemCategory.objects.create(hotel_id=HotelData.objects.get(hotel_id=3), item_category_name=category)

    
print("Category creation done!")

tax = TaxGroup.objects.get(hoteltax_group_id=1)
hotel=HotelData.objects.get(hotel_id=1)
print(tax)
for i in data.index:
    print(i)
    category = ItemCategory.objects.get(
        hotel_id=hotel, 
        item_category_name=data.CATEGORY[i]
    )
    if data.Variants[i] is not np.nan:
        product = Product.objects.create(
            hotel_id=hotel, 
            name=data.NAME[i], 
            unit_price = 0,
            item_category_id = category,
            tax_group_id = tax
        )
        
        item_variant_addon = ItemVariantAddOn.objects.create(
            hotel = hotel,
            item_id = product,
        )
        variants = data.Variants[i].split(',')
        variants_entries = []
        for var in variants:
            variant = VariantDetails.objects.create(
                hotel=hotel, 
                variant_value = var.split(':')[0],
                price = int(var.split(':')[1]),
                variant_desc = var.split(':')[0]
            )
            item_variant_addon.variant.add(variant)
            variants_entries.append(variant)
            print(var.split(':')[0])
        print("variants_entries\n\n", variants_entries)
        
    else:
        Product.objects.create(
            hotel_id=hotel, 
            name=data.NAME[i], 
            unit_price = int(data.PRICE[i]),
            item_category_id = category,
            tax_group_id = tax
        )