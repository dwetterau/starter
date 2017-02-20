#!/bin/bash

cd ~/deployments/starter/
python manage.py scrape_strava >> ./logs/scrape_strava.log 2>&1
