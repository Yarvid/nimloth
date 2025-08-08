from django.contrib import admin
from django.urls import path, include
from persons.views import PersonCreateView, get_csrf_token
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/person/", PersonCreateView.as_view()),
    path("api/get-csrf-token/", get_csrf_token),
    path("api/auth/", include("authentication.urls")),
]

urlpatterns = format_suffix_patterns(urlpatterns)