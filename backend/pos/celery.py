# import os

# from celery import Celery

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pos.settings')

# app = Celery('pos')

# app.config_from_object('django.conf:settings', namespace='CELERY')

# app.autodiscover_tasks()

# @app.task(bind=False)
# def debug_task(self):

#     print(f'Request: {self.request}')

# from hotel.models import PettyCash
# from background_task import background


# @background(schedule=60)
# def update_pettycash(hotel):
#     incoming = PettyCash.objects.get(hotel=hotel).incoming_amount
#     PettyCash.objects.update(hotel=hotel, incoming_amont = incoming + 100)