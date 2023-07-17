from rest_framework import serializers
from persons.models import Person

class PersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Person
        fields = ['id',
                  'first_name',
                  'middle_name',
                  'last_name',
                  'birth_name',
                  'artist_name',
                  'date_of_birth',
                  'place_of_birth',
                  'date_of_death',
                  'place_of_death',
                  'cause_of_death',
                  'mother',
                  'father',
                  'gender'
        ]
        