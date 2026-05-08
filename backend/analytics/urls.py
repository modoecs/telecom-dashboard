from django.urls import path
from .views import KPISummaryView, NPSBreakdownView

urlpatterns = [
    path('summary/', KPISummaryView.as_view(), name='kpi-summary'),
]

nps_urlpatterns = [
    path('breakdown/', NPSBreakdownView.as_view(), name='nps-breakdown'),
]