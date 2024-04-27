from rest_framework import serializers

from .models import KitchenServices


class KitchenServiceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = KitchenServices
        fields = '__all__'