from django.urls import path
from .views import ComplaintCategoriesView, ComplaintResolutionView

urlpatterns = [
    path('categories/', ComplaintCategoriesView.as_view(), name='complaint-categories'),
    path('resolution/', ComplaintResolutionView.as_view(), name='complaint-resolution'),
]