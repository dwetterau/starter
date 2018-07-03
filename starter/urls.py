"""starter URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth.forms import UserCreationForm
from django.views.generic import CreateView

from starter import views


urlpatterns = [
    url(r'^$', views.index),

    # Other urls that are resolved with react-router
    url(r'^plan/?$', views.index),
    url(r'^plan/[a-zA-Z0-9_]+/?$', views.index),
    url(r'^tasks/?$', views.index),
    url(r'^cal/?$', views.index),
    url(r'^cal/day/?$', views.index),
    url(r'^cal/week/?$', views.index),
    url(r'^tags/?$', views.index),
    url(r'^tag/[a-zA-Z0-9_]+/?$', views.index),
    url(r'^notes/?$', views.index),

    # Mobile capture storing page
    url(r'^capture/?$', views.capture_create),

    # Auth urls
    url(r'^auth/register/?$', CreateView.as_view(
        template_name='registration/register.html',
        form_class=UserCreationForm,
        success_url='/'
    )),
    url(r'^auth/login/?$', auth_views.login),
    url(r'^auth/logout/?$', views.logout),
    url(r'^auth/password_change/?$', auth_views.password_change),
    url(r'^auth/password_change_done/?$', auth_views.password_change_done),

    # API v1
    url(r'^api/1/task/create/?$', views.create_task),
    url(r'^api/1/task/update/?$', views.update_task),
    url(r'^api/1/task/delete/?$', views.delete_task),

    url(r'^api/1/event/create/?$', views.create_event),
    url(r'^api/1/event/update/?$', views.update_event),
    url(r'^api/1/event/delete/?$', views.delete_event),

    url(r'^api/1/tag/create/?$', views.create_tag),
    url(r'^api/1/tag/update/?$', views.update_tag),

    url(r'^api/1/note/create/?$', views.create_note),
    url(r'^api/1/note/update/?$', views.update_note),
    url(r'^api/1/note/delete/?$', views.delete_note),

    url(r'^api/1/capture/create/?$', views.create_capture),
    url(r'^api/1/capture/delete/?$', views.delete_capture),

    # Admin pages
    url(r'^admin/', admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
