from .models import ItemCategory
import pandas as pd

data = pd.read_csv(r"C:\\Users\\Ich07\\Downloads\\AArthi Sweets & Bakery - Sheet3.csv")

print(data.columns)
print(data.shape)
print(data.CATEGORY[0])

ItemCategory.objects.create(hotel_id=1, item_category_name=data.CATEGORY[0])