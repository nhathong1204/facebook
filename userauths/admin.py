from django.contrib import admin

from userauths.models import Profile, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    search_fields = ["full_name", "username", "email", "phone"]
    list_display = ["full_name", "username", "email", "phone"]


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    search_fields = ["user", "shop_name"]
    list_display = ["user", "full_name", "verified"]
    list_editable = ["verified"]
