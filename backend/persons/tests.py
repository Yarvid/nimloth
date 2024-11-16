from django.test import TestCase
from persons.models import Person
from datetime import date

# Create your tests here.
class PersonTestCase(TestCase):
    def setUp(self) -> None:

        create_args = {
            'first_name': 'Alice',
            'middle_name': 'Marie',
            'last_name': 'Thompson',
            'birth_name': 'Johnson',
            'artist_name': 'Harmony',
            'date_of_birth': date.today(1964, 1, 1),
            'gender': 'F',
        }

        create_args = {
            'first_name': 'Ethan',
            'last_name': 'Reynolds',
            'artist_name': 'Harmony',
            'date_of_birth': date.today(1975, 8, 12),
            'gender': 'F',
        }


        Person.objects.create(**create_args)

    def test_person_full_name(self):
        person = Person.objects.get(id=1)
        self.assertEqual(person.full_name(), 'Alice Marie Thompson')

    def test_person_time_since_birth(self):
        person = Person.object.get(id=1)
        self.assertEqual()
