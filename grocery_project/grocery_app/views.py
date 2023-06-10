import asyncio
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GroceryItem, GroceryList
from .serializers import GroceryItemSerializer, UserSerializer, GroceryListSerializer
from scraper import scraper_main
from rest_framework.decorators import api_view, action
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated


class GroceryListViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GroceryListSerializer

    def get_queryset(self):
        return GroceryList.objects.filter(users=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        list_name = data.get('name')
        if list_name:
            grocery_list = GroceryList.objects.create(
                name=list_name, creator=request.user)
            grocery_list.users.add(request.user)  # Add this line
            grocery_list.save()  # And this line
            return Response(GroceryListSerializer(grocery_list).data, status=status.HTTP_201_CREATED)
        return Response({'error': 'List name is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        grocery_list = self.get_object()
        # Change this line to get username instead of user_id
        username = request.data.get('username')
        try:
            # Change this line to find User by username instead of id
            user = User.objects.get(username=username)
            grocery_list.users.add(user)
            grocery_list.save()
            return Response({'status': 'user added to the list'})
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Only allow deletion if the current user is the creator of the list
        if request.user == instance.creator:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            # Non-creators can only remove the list from their view
            instance.users.remove(request.user)
            return Response({'status': 'List removed from your view'})

        return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        instance.delete()


class GroceryItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GroceryItemSerializer

    def get_queryset(self):
        list_id = self.request.query_params.get('list_id', None)
        if list_id is not None:
            return GroceryItem.objects.filter(list_id=list_id)
        return GroceryItem.objects.all()

    queryset = GroceryItem.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


@api_view(['POST'])
def compare_prices(request):
    list_id = request.data.get('list_id')

    if not list_id:
        return JsonResponse({'error': 'No list ID provided'}, status=400)

    # Fetch all products from the specified list
    product_list = list(GroceryItem.objects.filter(
        list_id=list_id).values_list('name', flat=True))

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
        return JsonResponse({'error': 'No products found in the list'}, status=400)


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
