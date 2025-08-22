"""uni_bot URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.urls import include, path, re_path

from openedx.core.constants import COURSE_ID_PATTERN  # pylint: disable=import-error

from uni_bot.views.tab_view import UniBotTabView


urlpatterns = [
    re_path(fr'courses/{COURSE_ID_PATTERN}/unibot', UniBotTabView.as_view(), name='unibot_tab'),
    path('uni_bot/api/', include('uni_bot.api.urls')),
]
