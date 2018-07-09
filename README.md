Starter
=====
_Yes, the name needs some work._

![Screenshot](/screenshot.png?raw=true "Screenshot")

## Initial setup:

$ virtualenv -p python3.5 --no-site-packages virtualenv/
$ source virtualenv/bin/activate
$ pip install django
$ django-admin.py startproject starter
$ cd starter
$ python manage.py migrate

## Testing:
```
npm test
```
![Test Status](https://travis-ci.com/dwetterau/starter.svg?branch=master)


