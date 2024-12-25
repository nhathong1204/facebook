from django.shortcuts import render, redirect
from core.models import Post
from django.http import JsonResponse
from django.utils.text import slugify
import shortuuid
from django.utils.timesince import timesince
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required


@login_required
def index(request):
    if not request.user.is_authenticated:
        return redirect("userauths:sign-in")
    posts = Post.objects.filter(active=True, visibility="Everyone").order_by("-id")
    context = {"posts": posts}
    return render(request, "core/index.html", context)


@csrf_exempt
def create_post(request):
    title = request.POST.get("post-caption")
    visibility = request.POST.get("visibility")
    image = request.FILES.get("post-thumbnail") or None
    
    uuid_key = shortuuid.uuid()
    uniqueid = uuid_key[:4]
    
    if title:
        post = Post.objects.create(
            title=title,
            visibility=visibility,
            image=image,
            user=request.user,
            slug=f"{slugify(title.lower())}-{str(uniqueid.lower())}",
        )
        post.save()
        
        # context = {
        #     "title": post.title,
        #     "image_url": post.image.url if post.image else None,
        #     "full_name": post.user.profile.full_name,
        #     "profile_image": post.user.profile.image.url,
        #     "date": timesince(post.date),
        #     "id": post.id,
        # }
        
        context = {"p": post}
        
        new_post_content = render_to_string('core/async/partial_post_content.html', context)
        return JsonResponse({"new_post_content": new_post_content})
        
        # return JsonResponse({ 
        #     'post': {
        #         "title": post.title,
        #         "image_url": post.image.url if post.image else None,
        #         "full_name": post.user.profile.full_name,
        #         "profile_image": post.user.profile.image.url,
        #         "date": timesince(post.date),
        #         "id": post.id,
        #     }
        # })
    else:
        return JsonResponse({"error": "Title does not exist"})

def like_post(request):
    id = request.GET.get("id")
    post = Post.objects.get(id=id)
    user = request.user
    bool = False

    if user in post.likes.all():
        post.likes.remove(user)
        bool = False
    else:
        post.likes.add(user)
        bool = True

    image_content = ""
    for index, item in enumerate(post.likes.all()):
        if index == 0:
            image_content += f'<img src="{item.profile.image.url}" class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900" alt="" />'
        else:
            image_content += f'<img src="{item.profile.image.url}" class="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 -ml-2" alt="" />'
    
    data = {
        "bool": bool,
        "likes": post.likes.all().count(),
        "image_content": image_content,
    }
    return JsonResponse({"data": data})
