from django.urls import path

from . import views

urlpatterns = [
    path('<str:origin_id>', views.tree_view),
]