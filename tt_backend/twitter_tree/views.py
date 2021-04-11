from django.shortcuts import render
from django.http import JsonResponse
from .models import Tree
from .replytree import ReplyTree

# Create your views here.
def tree_view(request, origin_id):

    rt = ReplyTree(str(origin_id))
    rt.populate_tree()

    return JsonResponse({'svg':rt.get_svg()})