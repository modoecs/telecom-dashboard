from django.db import models
from customers.models import Customer
from providers.models import Service

class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ('network_downtime',      'Network Downtime'),
        ('high_transaction_fees', 'High Transaction Fees'),
        ('slow_internet',         'Slow Internet'),
        ('support_delays',        'Customer Support Delays'),
        ('billing_errors',        'Billing Errors'),
    ]

    STATUS_CHOICES = [
        ('open',     'Open'),
        ('resolved', 'Resolved'),
        ('pending',  'Pending'),
    ]

    customer         = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='complaints')
    service          = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='complaints')
    category         = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    sentiment_score  = models.FloatField()           # -1.0 (very negative) to 1.0 (positive)
    resolution_time  = models.FloatField(null=True, blank=True)   # hours
    created_at       = models.DateTimeField(auto_now_add=True)
    resolved_at      = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.category} — Customer {self.customer_id}"