from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status
from hotel.models import HotelUser



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''
        Custom class to get the user token by assigning the username
    '''
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
  
        return Response(token, status=status.HTTP_403_FORBIDDEN)
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        data.update({'email': self.user.email})
        data.update({'first_name': self.user.first_name})
        data.update({'last_name': self.user.last_name})
        data.update({'status': status.HTTP_200_OK})
        
        # Check if the loggin user has been already attached to a hotel or not
        # hotel_user = self.user.hoteluser_set.all()
        hotel_user = HotelUser.objects.filter(user=self.user).exists()
        if hotel_user:
            # Chect if the user is attached to any hotel or not
            hotel = HotelUser.objects.filter(user = self.user)
            
            # Get the id of the belongins hotel
            id = hotel.values('hotel_id')[0]['hotel_id']

            # Add the hotel id to the response
            data.update({'hotel_id' : id})
            data.update({'role': hotel[0].role_id.role_name})
        else:
            # Add hotel_id as -1 that means that the user is not attached to any hotel yet
            data.update({'hotel_id' : -1})
        # and everything else you want to send in the response
        return data