from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import GroceryItem
from .serializers import GroceryItemSerializer


class GroceryItemViewSet(viewsets.ModelViewSet):
    queryset = GroceryItem.objects.all()
    serializer_class = GroceryItemSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()
