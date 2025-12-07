from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response


@ensure_csrf_cookie
@api_view(["GET"])
def get_csrf_token(request):
    """Return CSRF token for authentication."""
    return Response({"detail": "CSRF cookie set"})


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """Handle user login."""
    import json

    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {"error": "Username and password are required"}, status=400
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse(
                {
                    "success": True,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                },
                status=200,
            )
        else:
            return JsonResponse({"error": "Invalid username or password"}, status=401)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["POST"])
def logout_view(request):
    """Handle user logout."""
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out successfully"})


@api_view(["GET"])
def check_auth(request):
    """Check if user is authenticated."""
    if request.user.is_authenticated:
        return Response(
            {
                "authenticated": True,
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                    "first_name": request.user.first_name,
                    "last_name": request.user.last_name,
                },
            }
        )
    else:
        return Response({"authenticated": False})
