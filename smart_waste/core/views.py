from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.core.files.storage import FileSystemStorage
from django.contrib import messages
from .forms import LoginForm, RegisterForm, WasteUploadForm
from django.contrib.auth import login, logout
from .models import WasteUpload
def home(request):
    return render(request, 'core/home.html')

@login_required
def upload_file(request):
    if request.method == 'POST':
        form = WasteUploadForm(request.POST, request.FILES)
        if form.is_valid():
            waste = form.save(commit=False)
            waste.user = request.user
            waste.save()
            messages.success(request, 'File uploaded successfully!')
            return redirect('dashboard')
    else:
        form = WasteUploadForm()
    return render(request, 'core/upload.html', {'form': form})

1
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

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()  # Create the new user
            login(request, user)  # Log the user in immediately
            request.session['is_new_user'] = True
            return redirect('dashboard')  # Redirect to dashboard after login
    else:
        form = RegisterForm()
    
    return render(request, 'core/signup.html', {'form': form})

@login_required(login_url='login')
def dashboard_view(request):
    user = request.user
    context = {'user': user}

    # Check if new user
    if request.session.pop('is_new_user', False):
        # You can show a special welcome message or tutorial
        context['welcome_message'] = f"Welcome {user.username}! Glad to have you on Smart Waste."
        
    uploads = WasteUpload.objects.filter(user = request.user).order_by('-uploaded_at')
    
    stats = {
        'total_uploads': uploads.count(),
        'organic': uploads.filter(category='Organic').count(),
        'recyclable': uploads.filter(category='Recyclable').count(),
        'hazardous': uploads.filter(category='Hazardous').count(),
    }
    return render(request, 'core/dashboard.html', {'uploads': uploads, 'stats': stats, 'context' : context})
