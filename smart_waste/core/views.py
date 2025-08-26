from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.core.files.storage import FileSystemStorage
from django.contrib import messages
from .forms import LoginForm, RegisterForm
from django.contrib.auth import login, logout

def home(request):
    return render(request, 'core/home.html')

def upload_file(request):
    if request.method == 'POST' and request.FILES.get('waste_file'):
        uploaded_file = request.FILES['waste_file']
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        messages.success(request, f'File "{filename}" uploaded successfully!')
        return redirect('home')
    return redirect('home')

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = RegisterForm(request=request)
    return render(request, 'core/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
    else:
        form = LoginForm(request=request)  # pass request for AuthenticationForm
    return render(request, 'core/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')
