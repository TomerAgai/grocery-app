from django.db import models
from django.contrib.auth.models import User


class GroceryList(models.Model):
    name = models.CharField(max_length=200)
    creator = models.ForeignKey(
        User, related_name='created_lists', on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='shared_lists')

    def __str__(self):
        return self.name


class GroceryItem(models.Model):
    name = models.CharField(max_length=200)
    quantity = models.IntegerField(default=1)
    list = models.ForeignKey(
        GroceryList, related_name='items', on_delete=models.CASCADE)
    user = models.CharField(max_length=200)

    def __str__(self):
        return self.name
