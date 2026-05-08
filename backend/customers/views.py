from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from datetime import date, timedelta
from .models import Customer, SatisfactionScore
from complaints.models import Complaint
from providers.models import Provider

class ChurnSegmentsView(APIView):
    """
    GET /api/customers/churn-segments/
    Returns customer counts grouped into 4 churn risk segments.
    """
    def get(self, request):
        today = date.today()
        cutoff_60  = today - timedelta(days=60)
        cutoff_90  = today - timedelta(days=90)
        cutoff_new = today - timedelta(days=90)

        # IDs with 3+ complaints
        high_complaint_ids = set(
            Complaint.objects.values('customer_id')
            .annotate(cnt=Count('id'))
            .filter(cnt__gte=3)
            .values_list('customer_id', flat=True)
        )

        all_customers = Customer.objects.select_related('provider').all()

        segments = {
            'high_risk':    0,
            'dissatisfied': 0,
            'new_users':    0,
            'loyal':        0,
        }

        provider_churn = {
            p.slug: {'high_risk': 0, 'dissatisfied': 0, 'new_users': 0, 'loyal': 0}
            for p in Provider.objects.all()
        }

        for customer in all_customers:
            slug = customer.provider.slug
            is_new         = customer.signup_date >= cutoff_new
            is_inactive    = customer.last_activity and customer.last_activity <= cutoff_60
            has_complaints = customer.id in high_complaint_ids

            # Get their satisfaction score
            score_obj = SatisfactionScore.objects.filter(
                customer=customer
            ).first()
            is_dissatisfied = score_obj and score_obj.score <= 5

            if is_inactive or has_complaints:
                seg = 'high_risk'
            elif is_dissatisfied:
                seg = 'dissatisfied'
            elif is_new:
                seg = 'new_users'
            else:
                seg = 'loyal'

            segments[seg] += 1
            provider_churn[slug][seg] += 1

        return Response({
            'overall':   segments,
            'by_provider': provider_churn,
            'total':     sum(segments.values()),
        })


class SpendDistributionView(APIView):
    """
    GET /api/customers/spend-distribution/
    Returns customer count per monthly spend bucket (KShs).
    """
    def get(self, request):
        from .models import UsageRecord
        from django.db.models import Avg as DjAvg

        # Buckets in KShs — calibrated to real Safaricom ARPU (KShs 267–395)
        buckets = [
            {'label': '0–100',    'min': 0,     'max': 100},
            {'label': '100–200',  'min': 100,   'max': 200},
            {'label': '200–500',  'min': 200,   'max': 500},
            {'label': '500–1k',   'min': 500,   'max': 1000},
            {'label': '1k–2k',    'min': 1000,  'max': 2000},
            {'label': '2k–5k',    'min': 2000,  'max': 5000},
            {'label': '5k+',      'min': 5000,  'max': 999999},
        ]

        # Use most recent month's spend per customer
        from django.db.models import Max
        latest_month = UsageRecord.objects.aggregate(
            latest=Max('month')
        )['latest']

        results = []
        for bucket in buckets:
            count = UsageRecord.objects.filter(
                month=latest_month,
                monthly_spend__gte=bucket['min'],
                monthly_spend__lt=bucket['max'],
            ).count()
            results.append({
                'label': bucket['label'],
                'count': count,
                'min':   bucket['min'],
                'max':   bucket['max'],
            })

        # Average spend across all customers
        avg_spend = UsageRecord.objects.filter(
            month=latest_month
        ).aggregate(avg=DjAvg('monthly_spend'))['avg'] or 0

        return Response({
            'buckets':     results,
            'avg_spend':   round(float(avg_spend), 2),
            'currency':    'KShs',
            'period':      str(latest_month),
        })


class RegionalSatisfactionView(APIView):
    """
    GET /api/regions/satisfaction/
    Returns average satisfaction score per region.
    """
    def get(self, request):
        REGION_LABELS = {
            'nairobi':       'Nairobi',
            'coast':         'Coast',
            'western':       'Western',
            'rift_valley':   'Rift Valley',
            'north_eastern': 'N. Eastern',
            'central':       'Central',
            'eastern':       'Eastern',
            'nyanza':        'Nyanza',
        }

        results = []
        for slug, label in REGION_LABELS.items():
            avg = SatisfactionScore.objects.filter(
                customer__region=slug
            ).aggregate(avg=Avg('score'))['avg']

            csat = round((avg / 10) * 100, 1) if avg else 0

            # Customer count in region
            count = Customer.objects.filter(region=slug).count()

            results.append({
                'region':     slug,
                'label':      label,
                'csat':       csat,
                'customers':  count,
            })

        results.sort(key=lambda x: x['csat'], reverse=True)
        return Response(results)