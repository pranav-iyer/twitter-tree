from django.urls import path

from . import views

urlpatterns = [
    path('view/<str:origin_id>', views.tree_view),
]