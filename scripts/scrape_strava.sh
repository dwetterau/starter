#!/bin/bash

cd ~/deployments/starter/
source virtualenv/bin/activate
cd starter
../virtualenv/bin/python manage.py scrape_strava >> ../logs/scrape_strava.log 2>&1
