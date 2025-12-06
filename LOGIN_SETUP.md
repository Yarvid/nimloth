# Login Setup Instructions

This document provides instructions for setting up and testing the login functionality.

## Overview

The login functionality has been implemented with:
- **Backend**: Django session-based authentication with REST API endpoints
- **Frontend**: Angular login component with authentication service

## Backend Endpoints

- `POST /api/auth/login/` - Login endpoint
- `POST /api/auth/logout/` - Logout endpoint
- `GET /api/auth/check/` - Check authentication status

## Setup Instructions

### 1. Create a Test User

After starting the backend server, create a superuser account:

```bash
cd backend
python manage.py createsuperuser
```

Or use the default test credentials that will be created automatically:
- Username: `admin`
- Password: `admin`

To create this user manually:

```bash
python manage.py shell
```

Then in the Python shell:

```python
from django.contrib.auth.models import User
User.objects.create_superuser('admin', 'admin@example.com', 'admin')
exit()
```

### 2. Start the Development Servers

**Using Docker Compose (Recommended):**

```bash
docker-compose up
```

This will start both backend and frontend servers.

**Manual Start:**

Backend:
```bash
cd backend
python manage.py runserver
```

Frontend (in a separate terminal):
```bash
cd frontend
npm start
```

### 3. Access the Application

1. Open your browser and navigate to `http://localhost:4200`
2. You should see the login page
3. Enter your credentials:
   - Username: `admin`
   - Password: `admin` (or the password you set)
4. Click "Login"

### 4. Testing the Login Flow

After successful login:
- You will be redirected to the tree visualization page
- The navbar will show your username
- You can click "Logout" to log out
- After logout, you'll be redirected back to the login page

## Features

### Backend Features
- Session-based authentication using Django's built-in auth system
- CSRF protection enabled
- CORS configured for localhost:4200
- User information returned on successful login

### Frontend Features
- Beautiful gradient login page
- Form validation
- Error message display
- Loading state during authentication
- Automatic redirect after login/logout
- User info display in navbar
- Logout button in navbar

## Security Configuration

The current configuration is for development only:

```python
# In settings.py
SESSION_COOKIE_SAMESITE = None
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
CSRF_COOKIE_SAMESITE = None
CSRF_COOKIE_SECURE = False  # Set to True in production with HTTPS
```

**For production deployment**, you must:
1. Set `SESSION_COOKIE_SECURE = True`
2. Set `CSRF_COOKIE_SECURE = True`
3. Set `SESSION_COOKIE_SAMESITE = 'Lax'` or `'Strict'`
4. Set `CSRF_COOKIE_SAMESITE = 'Lax'` or `'Strict'`
5. Use HTTPS
6. Update `ALLOWED_HOSTS` in settings.py
7. Update `CORS_ALLOWED_ORIGINS` to include your production domain

## Troubleshooting

### Login fails with "Invalid username or password"
- Ensure you've created a user account
- Check that the username and password are correct
- Check the backend logs for errors

### CSRF errors
- Ensure `withCredentials: true` is set in HTTP requests
- Check that CORS_ALLOW_CREDENTIALS is True in settings.py
- Clear browser cookies and try again

### Can't access the tree visualization page
- Check that you're logged in
- Look at the browser console for errors
- Verify the backend is running on port 8000

## File Changes

### Backend Files
- `backend/persons/auth_views.py` - Authentication views
- `backend/nimloth/urls.py` - Added auth endpoints
- `backend/nimloth/settings.py` - Added REST framework and session config

### Frontend Files
- `frontend/src/app/models/user.interface.ts` - User data interfaces
- `frontend/src/app/auth.service.ts` - Authentication service
- `frontend/src/app/login/` - Login component (HTML, TS, SCSS)
- `frontend/src/app/app-routing.module.ts` - Added login route
- `frontend/src/app/app.module.ts` - Registered LoginComponent
- `frontend/src/app/navbar/` - Updated to show user info and logout

## Next Steps

Consider implementing:
- Route guards to protect authenticated routes
- Password reset functionality
- User registration page
- Remember me functionality
- Token-based authentication (JWT) as an alternative to sessions
- Multi-factor authentication
