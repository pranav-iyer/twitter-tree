from django.shortcuts import render
from django.http import JsonResponse, Http404
from .models import Tree
from .replytree import ReplyTree

# Create your views here.
def tree_view(request, origin_id):
    if not Tree.objects.filter(origin_id_str=origin_id):
        # create db entry
        t = Tree(origin_id_str=origin_id, svg="")
        t.save()

        try:
            # create ReplyTree (this is the step that takes time)
            rt = ReplyTree(str(origin_id))
            rt.populate_tree()
        except:
            t.delete()
            raise
        # update db entry
        t.svg = rt.get_svg()
        t.save()
        return JsonResponse({"svg":t.svg})
    else:
        t = Tree.objects.get(origin_id_str=origin_id)
        return JsonResponse({"svg":t.svg})