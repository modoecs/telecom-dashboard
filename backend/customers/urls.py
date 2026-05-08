from django.urls import path
from .views import (
    ChurnSegmentsView,
    SpendDistributionView,
    RegionalSatisfactionView,
)

urlpatterns = [
    path('churn-segments/',     ChurnSegmentsView.as_view(),      name='churn-segments'),
    path('spend-distribution/', SpendDistributionView.as_view(),  name='spend-distribution'),
]

regions_urlpatterns = [
    path('satisfaction/', RegionalSatisfactionView.as_view(), name='regional-satisfaction'),
]