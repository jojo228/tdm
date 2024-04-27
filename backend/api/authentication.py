from rest_framework.authentication import TokenAuthentication as BaseTokenAuth

class TokenAuthentication(BaseTokenAuth):
    '''
        This class is a custom Authentication class that will set the token as Bearer token
    '''
    keywork = 'Bearer'

