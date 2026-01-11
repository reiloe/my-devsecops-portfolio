---
title: 🐍 Flask
---

# Flask

**Flask basics, templates, forms, sessions, configuration, dev/prod setup, databases, security, and modularization**.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Simple Hello World](#3-simple-hello-world)
4. [Routing and Views](#4-routing-and-views)
5. [Templates (Jinja2)](#5-templates-jinja2)
6. [Forms and Request Handling](#6-forms-and-request-handling)
7. [Sessions & Cookies](#7-sessions--cookies)
8. [Configuration](#8-configuration)
9. [Development vs Production Setup](#9-development-vs-production-setup)
10. [Databases (Flask-SQLAlchemy)](#10-databases-flask-sqlalchemy)
11. [Extensions & Security](#11-extensions--security)
12. [Logging](#12-logging)
13. [Error Handling](#13-error-handling)
14. [Blueprints (Modularization)](#14-blueprints-modularization)
15. [Deployment Tips](#15-deployment-tips)

---

## 1. Introduction

Flask is a lightweight web framework for Python. It is easy to get started with and yet offers the flexibility to develop complex web applications.

### Key Features

- Minimalistic, easily extensible
- Supports templates (Jinja2)
- Simple routing definition
- Session management
- Extensible via extensions (e.g., SQLAlchemy, Flask-WTF)

---

## 2. Installation

```bash
# Install Python (>=3.8)
pip install Flask
```

**Optional for development:**

```bash
pip install flask-dotenv  # .env support
pip install flask-debugtoolbar  # Dev toolbar
```

---

## 3. Simple Hello World

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run(debug=True)
```

- `app.run(debug=True)` activates debug mode (development only!)
- Default port: 5000

---

## 4. Routing and Views

### 4.1 Dynamic URLs

```python
@app.route('/user/<username>')
def show_user(username):
    return f'User: {username}'
```

### 4.2 HTTP Methods

```python
from flask import request

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'Logging in...'
    return 'Login Page'
```

---

## 5. Templates (Jinja2)

### 5.1 Beispiel Template

```html
<!-- templates/home.html -->
<h1>Welcome {{ name }}</h1>
```

### 5.2 Render Template

```python
from flask import render_template

@app.route('/welcome/<name>')
def welcome(name):
    return render_template('home.html', name=name)
```

### 5.3 Template Features

- Variables: `{{ variable }}`
- Loops: `{% for item in items %}...{% endfor %}`
- Conditions: `{% if condition %}...{% endif %}`

---

## 6. Forms and Request Handling

### 6.1 Simple Form

```html
<form method="post" action="/submit">
  <input type="text" name="username">
  <button type="submit">Submit</button>
</form>
```

### 6.2 Read data in view

```python
from flask import request

@app.route('/submit', methods=['POST'])
def submit():
    username = request.form.get('username')
    return f'Hello {username}'
```

---

## 7. Sessions & Cookies

### 7.1 Session Example

```python
from flask import session

app.secret_key = 'secret'  # required for sessions

@app.route('/set_session')
def set_session():
    session['user'] = 'Alice'
    return 'Session set'

@app.route('/get_session')
def get_session():
    user = session.get('user', 'Guest')
    return f'User: {user}'
```

### 7.2 Cookies Example

```python
from flask import make_response

@app.route('/set_cookie')
def set_cookie():
    resp = make_response('Cookie set')
    resp.set_cookie('token', '12345')
    return resp
```

---

## 8. Configuration

### 8.1 Basic Settings

```python
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'secret'
app.config['SESSION_COOKIE_NAME'] = 'my_session'
```

### 8.2 Configuration via File

```python
# config.py
DEBUG = True
SECRET_KEY = 'secret'
SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'

# main.py
app.config.from_object('config')
```

### 8.3 Environment-specific Configuration

```python
import os
env = os.environ.get('FLASK_ENV', 'development')
if env == 'development':
    app.config.from_object('config.DevelopmentConfig')
else:
    app.config.from_object('config.ProductionConfig')
```

---

## 9. Development vs Production Setup

### 9.1 Development

- Enable `debug=True`
- Use Werkzeug dev server
- Optional Flask-DebugToolbar

### 9.2 Production

- Never `debug=True`!
- Use WSGI server (e.g., Gunicorn, uWSGI)

  ```bash
  pip install gunicorn
  gunicorn -w 4 -b 0.0.0.0:8000 main:app
  ```
  
- Enable logging
- Reverse proxy (nginx) optional

---

## 10. Databases (Flask-SQLAlchemy)

### 10.1 Installation

```bash
pip install Flask-SQLAlchemy
```

### 10.2 Example Model

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    # Create database
    with app.app_context():
    db.create_all()
```

### 10.3 CRUD Example

```python
@app.route('/add_user/<name>')
def add_user(name):
    user = User(username=name)
    db.session.add(user)
    db.session.commit()
    return f'User {name} added'
```

---

## 11. Extensions & Security

- **Flask-WTF**: Forms, CSRF protection
- **Flask-Login**: User authentication
- **Flask-Migrate**: DB migrations
- **Flask-Caching**: Caching

### 11.1 CSRF Example with Flask-WTF

```python
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField

class NameForm(FlaskForm):
    name = StringField('Name')
    submit = SubmitField('Submit')
```

---

## 12. Logging

### 12.1 Simple Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logging.info('Info message')
```

### 12.2 Production

- Log to file
- Use RotatingFileHandler

  ```python
  from logging.handlers import RotatingFileHandler
  handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
  app.logger.addHandler(handler)
  ```

---

## 13. Error Handling

```python
@app.errorhandler(404)
def page_not_found(e):
    return 'Page not found', 404

@app.errorhandler(500)
def internal_error(e):
    return 'Internal server error', 500
```

---

## 14. Blueprints (Modularization)

```python
from flask import Blueprint

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/')
def admin_home():
    return 'Admin area'

app.register_blueprint(admin_bp)
```

---

## 15. Deployment Tips

- Use WSGI server (Gunicorn, uWSGI)
- Reverse proxy (nginx)
- Environment variables for config
- Disable debug mode
- Enable logging
- Security headers (Flask-Talisman)

---
