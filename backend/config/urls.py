"""
URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URL configuration
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from app import views, api_views

urlpatterns = [
    # Django admin page
    path('admin/', admin.site.urls),

    ################################################################################
    # View Pages
    ################################################################################
    path('', views.index),
    path('example/', views.example),
    path('plot/', views.plot),
    path('example/<example_id>', views.example),

    ################################################################################
    # API endpoints
    ################################################################################
    path('api/1951-1962elections/', api_views.all_elections),
    path('api/1962-2019seats/', api_views.all_seats),
    path("api/SDE_DATA_IN_F7DSTRBND_1991/<int:feature_limit>", api_views.get_SDE_DATA_IN_F7DSTRBND_1991),
    path('api/electoral-bonds-denominations/', api_views.all_electoral_bonds_denominations)
]
