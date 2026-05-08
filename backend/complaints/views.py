from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg
from .models import Complaint
from providers.models import Provider

class ComplaintCategoriesView(APIView):
    """
    GET /api/complaints/categories/
    Returns complaint volume per category, with provider breakdown.
    """
    def get(self, request):
        CATEGORY_LABELS = {
            'network_downtime':      'Network Downtime',
            'high_transaction_fees': 'High Transaction Fees',
            'slow_internet':         'Slow Internet',
            'support_delays':        'Support Delays',
            'billing_errors':        'Billing Errors',
        }

        results = []
        for slug, label in CATEGORY_LABELS.items():
            total = Complaint.objects.filter(category=slug).count()

            # Breakdown per provider
            by_provider = {}
            for provider in Provider.objects.all():
                count = Complaint.objects.filter(
                    category=slug,
                    customer__provider=provider
                ).count()
                by_provider[provider.slug] = count

            # Average sentiment for this category
            avg_sentiment = Complaint.objects.filter(
                category=slug
            ).aggregate(avg=Avg('sentiment_score'))['avg'] or 0

            results.append({
                'category':      slug,
                'label':         label,
                'total':         total,
                'by_provider':   by_provider,
                'avg_sentiment': round(avg_sentiment, 2),
            })

        results.sort(key=lambda x: x['total'], reverse=True)
        return Response(results)


class ComplaintResolutionView(APIView):
    """
    GET /api/complaints/resolution/
    Returns average resolution time per provider per category.
    """
    def get(self, request):
        categories = [
            'network_downtime',
            'high_transaction_fees',
            'slow_internet',
            'support_delays',
            'billing_errors',
        ]

        results = []
        for provider in Provider.objects.all():
            row = {
                'provider': provider.name,
                'slug':     provider.slug,
                'by_category': {},
                'overall_avg': 0,
            }

            category_avgs = []
            for cat in categories:
                avg = Complaint.objects.filter(
                    customer__provider=provider,
                    category=cat,
                    status='resolved',
                    resolution_time__isnull=False,
                ).aggregate(avg=Avg('resolution_time'))['avg']

                val = round(avg, 1) if avg else 0
                row['by_category'][cat] = val
                if val > 0:
                    category_avgs.append(val)

            row['overall_avg'] = round(
                sum(category_avgs) / len(category_avgs), 1
            ) if category_avgs else 0

            results.append(row)

        return Response(results)