import shortuuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.utils.text import slugify
from PIL import Image
from shortuuid.django_fields import ShortUUIDField

RELATIONSHIP = (
    ("single", "Single"),
    ("married", "married"),
    ("inlove", "In Love"),
)


GENDER = (
    ("female", "Female"),
    ("male", "Male"),
)

WHO_CAN_SEE_MY_FRIENDS = (
    ("Only Me", "Only Me"),
    ("Everyone", "Everyone"),
)


def user_directory_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = "{}.{}".format(instance.user.id, ext)
    return f"user_{instance.user.id}/{filename}"


class User(AbstractUser):
    full_name = models.CharField(max_length=200)
    username = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=200)
    gender = models.CharField(max_length=100, choices=GENDER)
    otp = models.CharField(max_length=10, null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username


class Profile(models.Model):
    pid = ShortUUIDField(
        length=7, max_length=25, alphabet="abcdefghijklmnopqrstuvxyz123"
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cover_image = models.ImageField(
        upload_to=user_directory_path, default="cover.jpg", blank=True, null=True
    )
    image = models.ImageField(
        upload_to=user_directory_path, default="default.jpg", null=True, blank=True
    )
    full_name = models.CharField(max_length=1000, null=True, blank=True)
    bio = models.CharField(max_length=100, null=True, blank=True)
    about_me = models.CharField(max_length=1000, null=True, blank=True)
    phone = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=100, choices=GENDER, null=True, blank=True)
    relationship = models.CharField(
        max_length=100, choices=RELATIONSHIP, null=True, blank=True, default="single"
    )
    friends_visibility = models.CharField(
        max_length=100,
        choices=WHO_CAN_SEE_MY_FRIENDS,
        null=True,
        blank=True,
        default="Everyone",
    )
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=1000, null=True, blank=True)
    working_at = models.CharField(max_length=1000, null=True, blank=True)
    instagram = models.URLField(default="https://instagram.com/", null=True, blank=True)
    whatsApp = models.CharField(
        default="+123 (456) 789", max_length=100, blank=True, null=True
    )
    verified = models.BooleanField(default=False)
    followers = models.ManyToManyField(User, blank=True, related_name="followers")
    followings = models.ManyToManyField(User, blank=True, related_name="followings")
    friends = models.ManyToManyField(User, blank=True, related_name="friends")
    blocked = models.ManyToManyField(User, blank=True, related_name="blocked")
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            return str(self.user.username)

    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            uuid_key = shortuuid.uuid()
            uniqueid = uuid_key[:2]
            self.slug = slugify(self.full_name) + " - " + str(uniqueid.lower())
        super().save(*args, **kwargs)


def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
	instance.profile.save()


post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)