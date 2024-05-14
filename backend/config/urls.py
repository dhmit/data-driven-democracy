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
     path('competitiveness/', views.competitiveness),
     path('campaign-finance/top-10-donors-piechart/', views.PieChart),
     path('campaign-finance/top-10-donors-barchart/', views.BarChart),
     path('campaign-finance/donor-party-sankey/', views.FinanceSankey),
     path('castemap/', views.LoknitiCasteMap),


     ################################################################################
     # API endpoints
     ################################################################################
     path('api/1951-1962elections/', api_views.all_elections),
     path('api/1962-2019seats/', api_views.all_seats),
     path('api/ls-elections/', api_views.all_ls_elections),
     path('api/ls-elections/<int:year>/', api_views.get_ls_election_year),
     path('api/ls-elections/<int:year>/<str:state>/<int:constituency_no>/',
          api_views.get_specific_ls_election),
     path("api/SDE_DATA_IN_F7DSTRBND_1991/",
          api_views.get_SDE_DATA_IN_F7DSTRBND_1991),
     path("api/all-campaign-finance/", api_views.campaign_finance),
     path("api/campaign-finance/party-donor-pair/<str:party_name>/<str:donor_name>/",
          api_views.campaign_finance),
     path("api/campaign-finance/all-donors/<str:party_name>/",
          api_views.campaign_finance_party_subset),
     path("api/campaign-finance/all-parties/<str:donor_name>/",
          api_views.campaign_finance_donor_subset),
     path("api/India_PC_2019_simplified/",
          api_views.get_India_PC_2019_simplified),
     path("api/India_PC_2019/",
          api_views.get_India_PC_2019),
     path("api/competitiveness_colors/<int:election_year>/",
          api_views.get_competitiveness_data),
     path("api/codebook/",
          api_views.get_lokniti_codebook),
     path("api/responderstest/",
          api_views.get_lokniti_responders),
     path("api/responders/<int:election_year>/<str:state_name>/<int:pc_id>",
          api_views.get_responders_by_constituency)

]
