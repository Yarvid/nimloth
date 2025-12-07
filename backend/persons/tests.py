from datetime import date

from dateutil.relativedelta import relativedelta
from django.test import TestCase
from persons.models import Person
from rest_framework import status
from rest_framework.test import APIClient


# ==================== Model Tests ====================
class PersonModelTestCase(TestCase):
    """Test cases for the Person model."""

    def setUp(self) -> None:
        """Set up test data for Person model tests."""
        self.person_with_full_name = Person.objects.create(
            first_name="Alice",
            middle_name="Marie",
            last_name="Thompson",
            birth_name="Johnson",
            artist_name="Harmony",
            date_of_birth=date(1964, 1, 1),
            gender="F",
        )

        self.person_minimal = Person.objects.create(
            first_name="Bob",
            last_name="Smith",
            gender="M",
        )

        self.person_with_death = Person.objects.create(
            first_name="Charlie",
            last_name="Brown",
            date_of_birth=date(1950, 5, 15),
            date_of_death=date(2020, 10, 20),
            gender="M",
        )

        self.parent = Person.objects.create(
            first_name="Parent",
            last_name="Person",
            gender="F",
        )

        self.child = Person.objects.create(
            first_name="Child",
            last_name="Person",
            mother=self.parent,
            gender="U",
        )

    def test_person_full_name_with_all_parts(self):
        """Test full_name() with first, middle, and last name."""
        self.assertEqual(self.person_with_full_name.full_name(), "Alice Marie Thompson")

    def test_person_full_name_without_middle(self):
        """Test full_name() without middle name."""
        self.assertEqual(self.person_minimal.full_name(), "Bob Smith")

    def test_person_full_name_single_name(self):
        """Test full_name() with only first name."""
        person = Person.objects.create(first_name="Madonna", gender="F")
        self.assertEqual(person.full_name(), "Madonna")

    def test_person_time_since_birth_returns_dict(self):
        """Test time_since_birth() returns correct structure."""
        result = self.person_with_full_name.time_since_birth()
        self.assertIsInstance(result, dict)
        self.assertIn("years", result)
        self.assertIn("months", result)
        self.assertIn("days", result)

    def test_person_time_since_birth_calculates_correctly(self):
        """Test time_since_birth() calculates age correctly."""
        result = self.person_with_full_name.time_since_birth()
        expected_age = relativedelta(date.today(), date(1964, 1, 1))
        self.assertEqual(result["years"], expected_age.years)
        self.assertEqual(result["months"], expected_age.months)
        self.assertEqual(result["days"], expected_age.days)

    def test_person_time_since_birth_none_when_no_dob(self):
        """Test time_since_birth() returns None when date_of_birth is not set."""
        person = Person.objects.create(first_name="Unknown", gender="U")
        self.assertIsNone(person.time_since_birth())

    def test_person_time_since_death_returns_dict(self):
        """Test time_since_death() returns correct structure."""
        result = self.person_with_death.time_since_death()
        self.assertIsInstance(result, dict)
        self.assertIn("years", result)
        self.assertIn("months", result)
        self.assertIn("days", result)

    def test_person_time_since_death_none_when_alive(self):
        """Test time_since_death() returns None when person is alive."""
        self.assertIsNone(self.person_with_full_name.time_since_death())

    def test_person_gender_choices(self):
        """Test gender field accepts valid choices."""
        valid_genders = ["M", "F", "N", "U"]
        for gender in valid_genders:
            person = Person.objects.create(first_name="Test", gender=gender)
            self.assertEqual(person.gender, gender)

    def test_person_mother_relationship(self):
        """Test mother foreign key relationship."""
        self.assertEqual(self.child.mother, self.parent)
        self.assertIn(self.child, self.parent.mother_of.all())

    def test_person_father_relationship(self):
        """Test father foreign key relationship."""
        father = Person.objects.create(first_name="Father", gender="M")
        child = Person.objects.create(first_name="Child2", father=father, gender="U")
        self.assertEqual(child.father, father)
        self.assertIn(child, father.father_of.all())

    def test_person_optional_fields_can_be_blank(self):
        """Test that optional fields can be left blank."""
        person = Person.objects.create(first_name="Minimal", gender="U")
        self.assertEqual(person.middle_name, "")
        self.assertEqual(person.birth_name, "")
        self.assertEqual(person.artist_name, "")
        self.assertIsNone(person.date_of_birth)
        self.assertIsNone(person.mother)
        self.assertIsNone(person.father)

    def test_person_created_on_auto_set(self):
        """Test that created_on is automatically set."""
        person = Person.objects.create(first_name="AutoDate", gender="U")
        self.assertIsNotNone(person.created_on)
        self.assertEqual(person.created_on, date.today())

    def test_person_modified_on_auto_updates(self):
        """Test that modified_on updates automatically."""
        person = Person.objects.create(first_name="UpdateTest", gender="U")
        person.first_name = "Updated"
        person.save()
        self.assertIsNotNone(person.modified_on)


# ==================== API Tests ====================
class PersonAPITestCase(TestCase):
    """Test cases for Person API endpoints."""

    def setUp(self):
        """Set up test client and test data."""
        self.client = APIClient()
        self.person_data = {
            "first_name": "John",
            "middle_name": "Doe",
            "last_name": "Smith",
            "gender": "M",
            "date_of_birth": "1990-01-01",
        }
        self.person = Person.objects.create(
            first_name="Existing",
            last_name="Person",
            gender="F",
        )

    def test_get_all_persons(self):
        """Test GET request to retrieve all persons."""
        response = self.client.get("/api/person/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_person_valid_data(self):
        """Test POST request to create a new person with valid data."""
        response = self.client.post("/api/person/", self.person_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["first_name"], "John")
        self.assertEqual(response.data["middle_name"], "Doe")
        self.assertEqual(response.data["last_name"], "Smith")
        self.assertEqual(Person.objects.count(), 2)

    def test_create_person_minimal_data(self):
        """Test creating a person with minimal required data."""
        minimal_data = {"first_name": "Jane", "gender": "F"}
        response = self.client.post("/api/person/", minimal_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["first_name"], "Jane")

    def test_create_person_with_parent_relationship(self):
        """Test creating a person with parent relationships."""
        mother = Person.objects.create(first_name="Mother", gender="F")
        father = Person.objects.create(first_name="Father", gender="M")
        child_data = {
            "first_name": "Child",
            "gender": "U",
            "mother": mother.id,
            "father": father.id,
        }
        response = self.client.post("/api/person/", child_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["mother"], mother.id)
        self.assertEqual(response.data["father"], father.id)

    def test_get_person_by_id(self):
        """Test GET request to retrieve a specific person."""
        response = self.client.get(f"/api/person/{self.person.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Existing")
        self.assertEqual(response.data["last_name"], "Person")

    def test_get_person_not_found(self):
        """Test GET request for non-existent person."""
        response = self.client.get("/api/person/9999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_update_person(self):
        """Test PUT request to update a person."""
        updated_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "gender": "F",
        }
        response = self.client.put(
            f"/api/person/{self.person.id}/", updated_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Updated")
        self.assertEqual(response.data["last_name"], "Name")
        self.person.refresh_from_db()
        self.assertEqual(self.person.first_name, "Updated")

    def test_update_person_not_found(self):
        """Test PUT request for non-existent person."""
        response = self.client.put(
            "/api/person/9999/",
            {"first_name": "Test", "gender": "U"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_person(self):
        """Test DELETE request to delete a person."""
        person_id = self.person.id
        response = self.client.delete(f"/api/person/{person_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Person.objects.filter(id=person_id).exists())

    def test_delete_person_not_found(self):
        """Test DELETE request for non-existent person."""
        response = self.client.delete("/api/person/9999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# ==================== Serializer Tests ====================
class PersonSerializerTestCase(TestCase):
    """Test cases for PersonSerializer."""

    def setUp(self):
        """Set up test data."""
        self.person = Person.objects.create(
            first_name="Test",
            middle_name="Middle",
            last_name="Person",
            birth_name="BirthName",
            artist_name="Artist",
            date_of_birth=date(1980, 5, 15),
            place_of_birth="New York",
            gender="N",
        )

    def test_serializer_contains_expected_fields(self):
        """Test serializer contains all expected fields."""
        from persons.serializers import PersonSerializer

        serializer = PersonSerializer(instance=self.person)
        data = serializer.data
        expected_fields = [
            "id",
            "first_name",
            "middle_name",
            "last_name",
            "birth_name",
            "artist_name",
            "date_of_birth",
            "place_of_birth",
            "date_of_death",
            "place_of_death",
            "cause_of_death",
            "mother",
            "father",
            "gender",
        ]
        self.assertEqual(set(data.keys()), set(expected_fields))

    def test_serializer_field_values(self):
        """Test serializer returns correct field values."""
        from persons.serializers import PersonSerializer

        serializer = PersonSerializer(instance=self.person)
        data = serializer.data
        self.assertEqual(data["first_name"], "Test")
        self.assertEqual(data["middle_name"], "Middle")
        self.assertEqual(data["last_name"], "Person")
        self.assertEqual(data["birth_name"], "BirthName")
        self.assertEqual(data["artist_name"], "Artist")
        self.assertEqual(data["gender"], "N")
