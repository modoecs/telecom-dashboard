from django.db import models

class Provider(models.Model):
    PROVIDER_CHOICES = [
        ('safaricom', 'Safaricom'),
        ('airtel', 'Airtel Kenya'),
        ('telkom', 'Telkom Kenya'),
    ]

    name        = models.CharField(max_length=100)
    slug        = models.CharField(max_length=50, choices=PROVIDER_CHOICES, unique=True)
    founded     = models.IntegerField(default=2000)
    hq_location = models.CharField(max_length=100, default='Nairobi')
    market_share_percent = models.FloatField(default=0.0)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Service(models.Model):
    SERVICE_CHOICES = [
        ('mobile_money',     'Mobile Money'),
        ('data_bundles',     'Data Bundles'),
        ('voice',            'Voice'),
        ('sms',              'SMS'),
        ('customer_support', 'Customer Support'),
    ]

    provider     = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name='services')
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    is_active    = models.BooleanField(default=True)
    launched_at  = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('provider', 'service_type')

    def __str__(self):
        return f"{self.provider.name} — {self.service_type}"