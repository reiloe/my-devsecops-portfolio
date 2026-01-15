---
title: 🐍 Django
---

# Django

**Django basics, apps, models, views, templates, forms, static files, settings, auth, logging, and deployment**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Create Project](#3-create-project)
4. [Create Apps](#4-create-apps)
5. [Models](#5-models)
6. [Admin Interface](#6-admin-interface)
7. [Views and URL Routing](#7-views-and-url-routing)
8. [Templates](#8-templates)
9. [Forms](#9-forms)
10. [Static Files](#10-static-files)
11. [Settings & Configuration](#11-settings--configuration)
12. [Authentication](#12-authentication)
13. [Logging](#13-logging)
14. [Deployment Tips](#14-deployment-tips)

---

## 1. Introduction

Django is a powerful, fully-featured Python web framework. It follows the **MTV pattern** (Model-Template-View) and offers many built-in features.

### Key Features

- Batteries included (Admin, Auth, ORM, Forms)
- Security: CSRF, XSS, SQL Injection protection
- ORM for database access
- Template system (Django Templates)
- URL routing
- Simple deployment and scalability

---

## 2. Installation

```bash
# Install Python (>=3.8)
pip install Django
# Optional: virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

---

## 3. Create Project

```bash
django-admin startproject myproject
cd myproject
python manage.py runserver
```

- Default port: 8000
- `python manage.py runserver 0.0.0.0:8000` for network access

---

## 4. Create Apps

```bash
python manage.py startapp blog
```

- Each app contains models, views, templates, tests
- App must be registered in `INSTALLED_APPS`

```python
# myproject/settings.py
INSTALLED_APPS = [
'django.contrib.admin',
'django.contrib.auth',
'django.contrib.contenttypes',
'django.contrib.sessions',
'django.contrib.messages',
'django.contrib.staticfiles',
'blog',  # custom app
]
```

---

## 5. Models

### 5.1 Example Model

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

### 5.2 Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 6. Admin Interface

```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

- Zugriff unter `/admin`
- Admin-Konto erstellen:

  ```bash
  python manage.py createsuperuser
  ```

---

## 7. Views and URL Routing

### 7.1 Views

```python
from django.shortcuts import render, get_object_or_404
from .models import Post

def post_list(request):
    posts = Post.objects.all()
    return render(request, 'blog/post_list.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})
```

### 7.2 URLs

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
]
```

- Register project URLs:

```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
]
```

---

## 8. Templates

### 8.1 Template Beispiel

```html
<!-- blog/templates/blog/post_list.html -->
<h1>Blog Posts</h1>
<ul>
  {% for post in posts %}
    <li><a href="{% url 'post_detail' post.pk %}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
```

- Template Features:
  - Variables: `{{ variable }}`
  - Loops: `{% for ... %} ... {% endfor %}`
  - Conditions: `{% if ... %} ... {% endif %}`---

## 9. Forms

### 9.1 ModelForm Example

```python
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content']
```

### 9.2 View with Form

```python
from django.shortcuts import redirect
from .forms import PostForm

def post_new(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('post_list')
        else:
            form = PostForm()
            return render(request, 'blog/post_edit.html', {'form': form})
```

---

## 10. Static Files

### 10.1 Settings

```python
# settings.py
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
```

### 10.2 Include in Template

```html
{% load static %}
<link rel="stylesheet" href="{% static 'css/style.css' %}">
```

---

## 11. Settings & Configuration

### 11.1 Development

```python
DEBUG = True
ALLOWED_HOSTS = []  # all hosts allowed
```

### 11.2 Production

```python
DEBUG = False
ALLOWED_HOSTS = ['example.com']
SECURE_SSL_REDIRECT = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
```

### 11.3 Database (PostgreSQL Example)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 12. Authentication

- Users: `django.contrib.auth`
- Login/Logout:
  
```python
  from django.contrib.auth import authenticate, login, logout
  ```

- Password hashing, permissions, groups integrated

---

## 13. Logging

```
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```text

---

## 14. Deployment Tips

- WSGI Server: Gunicorn, uWSGI
- Reverse Proxy: nginx
- `DEBUG = False`
- Collect static files: `python manage.py collectstatic`
- Activate security middleware: `SECURE_SSL_REDIRECT`, `CSRF_COOKIE_SECURE`

---
