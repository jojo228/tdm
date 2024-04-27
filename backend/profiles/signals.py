from django.contrib.auth.models import User
from django.db.models.signals import (
    post_delete
)
from django.dispatch import receiver

from .models import UserProfile


# ----------------------------------------------------------------------------------------#
#                                Definition: Signal to delete                             #
#-----------------------------------------------------------------------------------------#
def deleteUser(sender, instance, **kwargs):
    try:
        user = instance.user
        user.delete()
    except :
        pass
    
post_delete.connect(deleteUser, sender=UserProfile)
