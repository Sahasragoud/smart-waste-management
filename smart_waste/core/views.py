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

    return render(request, 'core/dashboard.html', context)