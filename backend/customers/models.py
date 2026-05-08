from django.db import models
from providers.models import Provider

class Customer(models.Model):
    REGION_CHOICES = [
        ('nairobi',       'Nairobi'),
        ('coast',         'Coast'),
        ('western',       'Western'),
        ('rift_valley',   'Rift Valley'),
        ('north_eastern', 'North Eastern'),
        ('central',       'Central'),
        ('eastern',       'Eastern'),
        ('nyanza',        'Nyanza'),
    ]

    SUBSCRIPTION_CHOICES = [
        ('prepaid',    'Prepaid'),
        ('postpaid',   'Postpaid'),
        ('enterprise', 'Enterprise'),
    ]

    provider          = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name='customers')
    region            = models.CharField(max_length=50, choices=REGION_CHOICES)
    subscription_type = models.CharField(max_length=20, choices=SUBSCRIPTION_CHOICES)
    signup_date       = models.DateField()
    is_active         = models.BooleanField(default=True)
    last_activity     = models.DateField(null=True, blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Customer {self.id} — {self.provider.name}"


class UsageRecord(models.Model):
    customer          = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='usage_records')
    month             = models.DateField()          # store as first day of month e.g. 2024-01-01
    data_usage_gb     = models.FloatField(default=0.0)
    call_minutes      = models.IntegerField(default=0)
    transaction_count = models.IntegerField(default=0)
    monthly_spend     = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    class Meta:
        unique_together = ('customer', 'month')

    def __str__(self):
        return f"Usage: Customer {self.customer_id} — {self.month}"


class SatisfactionScore(models.Model):
    customer    = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='satisfaction_scores')
    service     = models.ForeignKey('providers.Service', on_delete=models.CASCADE, related_name='satisfaction_scores')
    score       = models.IntegerField()              # 1–10
    nps_response = models.IntegerField()             # 0–10
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Score {self.score} — Customer {self.customer_id}"