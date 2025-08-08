from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Person
from .serializers import PersonSerializer


class PersonCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Add authentication requirement
    
    def post(self, request, format=None):
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, format=None):
        persons = Person.objects.all()
        serializer = PersonSerializer(persons, many=True)
        return Response(serializer.data)


def get_csrf_token(request):
    csrf_token = get_token(request)
    response = JsonResponse({"detail": "CSRF cookie set"})
    response.set_cookie(
        "csrftoken", csrf_token, secure=True, httponly=True, samesite="None"
    )
    return response