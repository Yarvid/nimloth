from django.contrib.auth.models import User
from persons.models import Person
from rest_framework import serializers


class UserAccountSerializer(serializers.ModelSerializer):
    """Serializer for user account information within a person."""

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]
        read_only_fields = ["id"]


class PersonSerializer(serializers.ModelSerializer):
    user_account = UserAccountSerializer(required=False, allow_null=True)

    class Meta:
        model = Person
        fields = [
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
            "user_account",
        ]

    def create(self, validated_data):
        """Create a person with optional user account."""
        user_account_data = validated_data.pop("user_account", None)

        # Create the person instance
        person = Person.objects.create(**validated_data)

        # Create associated user account if provided
        if user_account_data:
            password = user_account_data.pop("password", None)
            user = User.objects.create(**user_account_data)
            if password:
                user.set_password(password)
                user.save()
            person.user_account = user
            person.save()

        return person

    def update(self, instance, validated_data):
        """Update a person and optionally their user account."""
        user_account_data = validated_data.pop("user_account", None)

        # Update person fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or create user account if provided
        if user_account_data is not None:
            if instance.user_account:
                # Update existing user account
                password = user_account_data.pop("password", None)
                for attr, value in user_account_data.items():
                    setattr(instance.user_account, attr, value)
                if password:
                    instance.user_account.set_password(password)
                instance.user_account.save()
            else:
                # Create new user account
                password = user_account_data.pop("password", None)
                user = User.objects.create(**user_account_data)
                if password:
                    user.set_password(password)
                    user.save()
                instance.user_account = user
                instance.save()

        return instance
