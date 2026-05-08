from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from datetime import date, timedelta
from customers.models import Customer, SatisfactionScore
from complaints.models import Complaint
from providers.models import Provider

class KPISummaryView(APIView):
    """
    GET /api/kpis/summary/
    Returns all executive KPI cards in one response.
    """
    def get(self, request):
        today = date.today()
        cutoff_60 = today - timedelta(days=60)

        total_customers = Customer.objects.count()

        # Overall CSAT
        avg_score = SatisfactionScore.objects.aggregate(
            avg=Avg('score')
        )['avg'] or 0
        overall_csat = round((avg_score / 10) * 100, 1)

        # Overall NPS
        all_nps = list(
            SatisfactionScore.objects.values_list('nps_response', flat=True)
        )
        total_nps = len(all_nps)
        if total_nps > 0:
            promoters  = sum(1 for s in all_nps if s >= 9)
            detractors = sum(1 for s in all_nps if s <= 6)
            overall_nps = round(((promoters - detractors) / total_nps) * 100)
        else:
            overall_nps = 0

        # Churn risk
        high_complaint_ids = set(
            Complaint.objects.values('customer_id')
            .annotate(cnt=Count('id'))
            .filter(cnt__gte=3)
            .values_list('customer_id', flat=True)
        )
        churn_count = Customer.objects.filter(
            Q(last_activity__lte=cutoff_60) | Q(id__in=high_complaint_ids)
        ).count()
        churn_risk_pct = round((churn_count / total_customers) * 100, 1)

        # Complaint rate
        total_complaints = Complaint.objects.count()
        complaint_rate   = round((total_complaints / total_customers) * 100, 1)

        # Average resolution time
        avg_resolution = Complaint.objects.filter(
            status='resolved',
            resolution_time__isnull=False,
        ).aggregate(avg=Avg('resolution_time'))['avg'] or 0

        # Provider with highest complaints
        worst_provider = (
            Complaint.objects.values('customer__provider__name')
            .annotate(cnt=Count('id'))
            .order_by('-cnt')
            .first()
        )

        # Month-over-month customer growth (approximate)
        last_month_cutoff = today - timedelta(days=30)
        new_this_month = Customer.objects.filter(
            signup_date__gte=last_month_cutoff
        ).count()
        mom_growth = round((new_this_month / total_customers) * 100, 1)

        return Response({
            'total_customers':          total_customers,
            'overall_csat':             overall_csat,
            'overall_nps':              overall_nps,
            'churn_risk_pct':           churn_risk_pct,
            'churn_risk_count':         churn_count,
            'complaint_rate':           complaint_rate,
            'total_complaints':         total_complaints,
            'avg_resolution_hours':     round(avg_resolution, 1),
            'resolution_sla_hours':     24,
            'highest_complaint_provider': worst_provider['customer__provider__name'] if worst_provider else None,
            'mom_growth_pct':           mom_growth,
            'new_customers_this_month': new_this_month,
        })


class NPSBreakdownView(APIView):
    """
    GET /api/nps/breakdown/
    Returns promoter / passive / detractor split per provider.
    NPS = % Promoters - % Detractors
    """
    def get(self, request):
        results = []

        for provider in Provider.objects.all():
            scores = list(
                SatisfactionScore.objects.filter(
                    customer__provider=provider
                ).values_list('nps_response', flat=True)
            )

            total = len(scores)
            if total == 0:
                continue

            promoters  = sum(1 for s in scores if s >= 9)
            passives   = sum(1 for s in scores if 7 <= s <= 8)
            detractors = sum(1 for s in scores if s <= 6)

            pct_promoters  = round((promoters  / total) * 100, 1)
            pct_passives   = round((passives   / total) * 100, 1)
            pct_detractors = round((detractors / total) * 100, 1)
            nps_score      = round(pct_promoters - pct_detractors)

            results.append({
                'provider':         provider.name,
                'slug':             provider.slug,
                'total_responses':  total,
                'promoters':        promoters,
                'passives':         passives,
                'detractors':       detractors,
                'pct_promoters':    pct_promoters,
                'pct_passives':     pct_passives,
                'pct_detractors':   pct_detractors,
                'nps_score':        nps_score,
            })

        results.sort(key=lambda x: x['nps_score'], reverse=True)
        return Response(results)