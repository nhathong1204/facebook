from django.shortcuts import render, redirect
from django.contrib import messages
from userauths.forms import UserRegisterForm

def RegisterView(request, *args, **kwargs):
    if request.user.is_authenticated:
        messages.warning(request, f"Hey {request.user.username}, you are already logged in")
        return redirect('core:feed')

    form = UserRegisterForm(request.POST or None)
    if form.is_valid():