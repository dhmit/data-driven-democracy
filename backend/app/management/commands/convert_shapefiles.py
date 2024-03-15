"""
Django management command convert_shapefiles

Convert shapefiles to geojson
"""
import os
import json
import shapefile

from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Custom django-admin command used to convert shapefiles in app/data/shapefiles
    to geojson files in app/data/geojson
    """
    help = ''

    def handle(self, *args, **options):
        for item in os.scandir(os.path.join(settings.DATASET_DIR, "shapefiles")):
            _, item_name = os.path.split(item.path)
            geojson_path = os.path.join(settings.GEOJSON_DIR, item_name + ".geojson")

            if not item.is_dir() or os.path.exists(geojson_path):
                continue

            sf = shapefile.Reader(os.path.join(item.path, item_name + ".shp"))
            geojson = sf.__geo_interface__
            with open(geojson_path, "w+", encoding="utf-8") as f:
                json.dump(geojson, f)
