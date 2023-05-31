from django.db import models


class GroceryItem(models.Model):
    name = models.CharField(max_length=200)
    quantity = models.IntegerField(default=1)
    user = models.CharField(max_length=200)

    def __str__(self):
        return self.name
