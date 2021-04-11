from django.db import models

# Create your models here.
class Tree(models.Model):
    origin_id_str = models.CharField(max_length=40)
    svg = models.TextField()

    def __str__(self):
        return self.origin_id_str