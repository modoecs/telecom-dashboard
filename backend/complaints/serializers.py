from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(
        source='customer.provider.name', read_only=True
    )

    class Meta:
        model = Complaint
        fields = '__all__'