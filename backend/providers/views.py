from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from .models import Provider, Service
from customers.models import SatisfactionScore
from complaints.models import Complaint

class ProviderBenchmarkView(APIView):
    """
    GET /api/providers/benchmark/
    Returns competitive comparison table for all providers.
    """
    def get(self, request):
        results = []

        for provider in Provider.objects.all():
            customers = provider.customers.all()
            total_customers = customers.count()

            if total_customers == 0:
                continue

            # CSAT — average satisfaction score scaled to percentage
            avg_score = SatisfactionScore.objects.filter(
                customer__provider=provider
            ).aggregate(avg=Avg('score'))['avg'] or 0
            csat = round((avg_score / 10) * 100, 1)

            # NPS calculation
            nps_scores = SatisfactionScore.objects.filter(
                customer__provider=provider
            ).values_list('nps_response', flat=True)

            total_nps = len(nps_scores)
            if total_nps > 0:
                promoters  = sum(1 for s in nps_scores if s >= 9)
                detractors = sum(1 for s in nps_scores if s <= 6)
                nps = round(((promoters - detractors) / total_nps) * 100)
            else:
                nps = 0

            # Complaint rate
            total_complaints = Complaint.objects.filter(
                customer__provider=provider
            ).count()
            complaint_rate = round((total_complaints / total_customers) * 100, 1)

            # Average resolution time (resolved complaints only)
            avg_resolution = Complaint.objects.filter(
                customer__provider=provider,
                status='resolved',
                resolution_time__isnull=False
            ).aggregate(avg=Avg('resolution_time'))['avg'] or 0

            # Churn risk — customers inactive 60+ days OR 3+ complaints
            from datetime import date, timedelta
            cutoff = date.today() - timedelta(days=60)

            high_complaint_ids = (
                Complaint.objects.filter(customer__provider=provider)
                .values('customer_id')
                .annotate(cnt=Count('id'))
                .filter(cnt__gte=3)
                .values_list('customer_id', flat=True)
            )

            churn_count = customers.filter(
                Q(last_activity__lte=cutoff) | Q(id__in=high_complaint_ids)
            ).count()
            churn_risk = round((churn_count / total_customers) * 100, 1)

            # SPI — Service Performance Index (composite score)
            # Formula: (CSAT*0.35) + (NPS_norm*0.25) + (complaint_inv*0.25) + (resolution_inv*0.15)
            nps_norm        = ((nps + 100) / 200) * 100   # normalise -100→+100 to 0→100
            complaint_inv   = max(0, 100 - (complaint_rate * 3))
            resolution_inv  = max(0, 100 - (avg_resolution / 72 * 100))
            spi = round(
                (csat * 0.35) +
                (nps_norm * 0.25) +
                (complaint_inv * 0.25) +
                (resolution_inv * 0.15),
                1
            )

            results.append({
                'provider':         provider.name,
                'slug':             provider.slug,
                'market_share':     provider.market_share_percent,
                'total_customers':  total_customers,
                'csat':             csat,
                'nps':              nps,
                'complaint_rate':   complaint_rate,
                'avg_resolution_hours': round(avg_resolution, 1),
                'churn_risk':       churn_risk,
                'spi':              spi,
            })

        # Sort by SPI descending
        results.sort(key=lambda x: x['spi'], reverse=True)
        return Response(results)


class ServiceSatisfactionView(APIView):
    """
    GET /api/services/satisfaction/
    Returns satisfaction score per provider per service type.
    """
    def get(self, request):
        service_types = [
            'mobile_money', 'data_bundles',
            'voice', 'sms', 'customer_support'
        ]
        results = []

        for stype in service_types:
            row = {'service': stype, 'scores': {}}
            for provider in Provider.objects.all():
                avg = SatisfactionScore.objects.filter(
                    customer__provider=provider,
                    service__service_type=stype
                ).aggregate(avg=Avg('score'))['avg']

                row['scores'][provider.slug] = round((avg / 10) * 100, 1) if avg else 0

            results.append(row)

        return Response(results)