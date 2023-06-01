import asyncio
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import GroceryItem
from .serializers import GroceryItemSerializer
from scraper import scraper_main
from rest_framework.decorators import api_view


class GroceryItemViewSet(viewsets.ModelViewSet):
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
