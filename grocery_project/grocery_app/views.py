import asyncio
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GroceryItem
from .serializers import GroceryItemSerializer, UserSerializer
from scraper import scraper_main
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated


class GroceryItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = GroceryItem.objects.all()
    serializer_class = GroceryItemSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


@api_view(['GET'])
def compare_prices(request):
    # Fetch all products from the database
    product_list = list(GroceryItem.objects.values_list('name', flat=True))

    if product_list:
        # start a new event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        # run our scraper and wait for it to finish
        result = loop.run_until_complete(scraper_main(product_list))
        # create a response dictionary
        response = {
            'yochananof_total_price': result[0],
            'shufersal_total_price': result[1],
            'not_found_list_yochananof': result[2],
            'not_found_list_shufersal': result[3],
        }
        return JsonResponse(response, status=200)
    else:
        # return error message if product_list is None
        return JsonResponse({'error': 'No products found in the database'}, status=400)


# User Registration View
class UserCreate(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'userid': user.id, 'username': user.username}, status=200)
        else:
            return Response({'error': 'Invalid Credentials'}, status=400)


class UserLogoutView(APIView):
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=204)
