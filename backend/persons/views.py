from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Person
from .serializers import PersonSerializer


class PersonCreateView(APIView):
    @csrf_exempt
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


class PersonDetailView(APIView):
    @csrf_exempt
    def get(self, request, pk, format=None):
        try:
            person = Person.objects.get(pk=pk)
            serializer = PersonSerializer(person)
            return Response(serializer.data)
        except Person.DoesNotExist:
            return Response(
                {"error": "Person not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @csrf_exempt
    def put(self, request, pk, format=None):
        try:
            person = Person.objects.get(pk=pk)
            serializer = PersonSerializer(person, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response(
                {"error": "Person not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @csrf_exempt
    def delete(self, request, pk, format=None):
        try:
            person = Person.objects.get(pk=pk)
            person.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Person.DoesNotExist:
            return Response(
                {"error": "Person not found"}, status=status.HTTP_404_NOT_FOUND
            )


def get_csrf_token(request):
    # FIXME: CSRF Cookie is not stored in Browser if set_cookie() is not used
    csrf_token = get_token(request)
    response = JsonResponse({"detail": "CSRF cookie set"})
    response.set_cookie(
        "csrftoken", csrf_token, secure=True, httponly=True, samesite="None"
    )

    return response
