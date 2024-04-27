"""pos URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

# Import the simple_jwt views for authenticaton


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),

    # path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path("__debug__/", include("debug_toolbar.urls")),
    
    path('', include('hotel.urls')),
    path('', include('sales.urls')),
    path('', include('expense_tracking.urls')),
    path('', include('inventory.urls')),
    path('', include('services.urls')),
]

