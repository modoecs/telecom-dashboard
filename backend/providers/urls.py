from django.urls import path
from .views import ProviderBenchmarkView, ServiceSatisfactionView

urlpatterns = [
    path('benchmark/',    ProviderBenchmarkView.as_view(),    name='provider-benchmark'),
    path('satisfaction/', ServiceSatisfactionView.as_view(),  name='service-satisfaction'),
]