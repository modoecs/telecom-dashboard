from rest_framework import serializers
from .models import Customer, UsageRecord, SatisfactionScore

class CustomerSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.name', read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'

class UsageRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageRecord
        fields = '__all__'