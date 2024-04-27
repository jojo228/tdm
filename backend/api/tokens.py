from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenObtainSerializer
class TokenObtainPairSerializer(TokenObtainSerializer):
    token_class = RefreshToken

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['first_name'] = str(self.user.first_name)
        data['first_name'] = str(self.user.first_name)
        data['email'] = str(self.user.email)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data