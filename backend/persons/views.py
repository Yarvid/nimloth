from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import PersonSerializer
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class PersonCreateView(APIView):
    @csrf_exempt
    def post(self, request, format=None):
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

def get_csrf_token(request):
    # FIXME: CSRF Cookie is not stored in Browser if set_cookie() is not used
    csrf_token = get_token(request)
    response = JsonResponse({"detail": "CSRF cookie set"})
    response.set_cookie("csrftoken", csrf_token, secure=True, httponly=True, samesite="None")

    return response