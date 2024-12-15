from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.forms import FileInput, ImageField, Select, TextInput

from userauths.models import Profile, User


class UserRegisterForm(UserCreationForm):
    full_name = forms.CharField(
        widget=forms.TextInput(
            attrs={"class": "", "id": "full_name", "placeholder": "Full Name"}
        ),
        max_length=100,
        required=True,
    )
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={"class": "", "id": "username", "placeholder": "Username"}
        ),
        max_length=100,
        required=True,
    )
    phone = forms.CharField(
        widget=forms.TextInput(
            attrs={"class": "", "id": "phone", "placeholder": "Mobile No."}
        ),
        max_length=100,
        required=True,
    )
    email = forms.EmailField(
        widget=forms.TextInput(
            attrs={"class": "", "id": "email", "placeholder": "Email Address"}
        ),
        required=True,
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={"id": "password1", "placeholder": "Password"}),
        required=True,
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={"id": "password2", "placeholder": "Confirm Password"}),
        required=True,
    )
    # gender = forms.CharField(widget=forms.TextInput(attrs={ 'class': 'with-border' , 'id': "", 'placeholder':'Enter Gender'}))

    class Meta:
        model = User
        fields = [
            "full_name",
            "username",
            "email",
            "password1",
            "password2",
            "phone",
            "gender",
        ]


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'with-border'
            # visible.field.widget.attrs['placeholder'] = visible.field.label


# class ProfileUpdateForm(forms.ModelForm):
#     image = ImageField(widget=FileInput)

#     class Meta:
#         model = Profile
#         fields = [
#             'cover_image' ,
#             'image' ,
#             'full_name',
#             'bio',
#             'about_me',
#             'phone',
#             'gender',
#             'relationship',
#             'friends_visibility',
#             'country',
#             'city',
#             'state',
#             'address',
#             'working_at',
#             'instagram',
#             'whatsApp',
#         ]

# class UserUpdateForm(forms.ModelForm):
#     class Meta:
#         model = User
#         fields = ['username', 'email']
