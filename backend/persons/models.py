from datetime import date, datetime

from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User
from django.db import models


class Person(models.Model):
    # --- Names ---
    first_name = models.CharField(max_length=50, blank=True)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    birth_name = models.CharField(max_length=50, blank=True)
    artist_name = models.CharField(max_length=50, blank=True)
    # --- Birth ---
    date_of_birth = models.DateField(null=True)
    place_of_birth = models.CharField(max_length=100, blank=True)
    # --- Death ---
    date_of_death = models.DateField(null=True)
    place_of_death = models.CharField(max_length=100, blank=True)
    cause_of_death = models.CharField(max_length=100, blank=True)
    # --- Relationship ---
    mother = models.ForeignKey(
        "self",
        models.SET_NULL,
        blank=True,
        null=True,
        related_name="mother_of",
    )
    father = models.ForeignKey(
        "self",
        models.SET_NULL,
        blank=True,
        null=True,
        related_name="father_of",
    )
    # --- Other ---
    gender = models.CharField(
        max_length=1,
        choices=[
            ("M", "Male"),
            ("F", "Female"),
            ("N", "Non-Binary"),
            ("U", "Unspecified"),
        ],
        default="U",
    )
    # --- User Account ---
    user_account = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="person",
        help_text="Associated user account for login access",
    )
    # --- Modifictation log ---
    created_on = models.DateField(auto_now_add=True, null=True)
    modified_on = models.DateField(auto_now=True, null=True)
    created_by = models.ForeignKey(
        "self",
        models.SET_NULL,
        blank=True,
        null=True,
        related_name="created_persons",
    )
    modified_by = models.ForeignKey(
        "self",
        models.SET_NULL,
        blank=True,
        null=True,
        related_name="modified_persons",
    )

    def __str__(self):
        """
        Returns a string representation of the person.
        """
        return self.full_name() or f"Person {self.id}"

    def full_name(self):
        """
        Returns the full name of a person.
        """
        return " ".join(
            [
                name
                for name in [self.first_name, self.middle_name, self.last_name]
                if name
            ]
        )

    def time_since_birth(self):
        if self.date_of_birth is None:
            return None

        return _time_difference(self.date_of_birth)

    def time_since_death(self):
        if not self.date_of_death:
            return None

        return _time_difference(self.date_of_death)

    def time_since_modification(self):
        if not self.modified_on:
            return None

        return _time_difference(self.modified_on)


def _time_difference(d) -> dict:
    """
    Calculate the precise difference between a given date/datetime and the current date/datetime.

    Parameters:
    -----------
    d : datetime.date or datetime.datetime
        The date or datetime to compare against the current date/time.

    Returns:
    --------
    dict
        A dictionary containing the difference in:
        - years
        - months
        - days
        - hours (only if `d` is a datetime)
        - minutes (only if `d` is a datetime)
        - seconds (only if `d` is a datetime)

    Raises:
    -------
    TypeError
        If the provided input is neither a date nor a datetime.

    Example:
    --------
    >>> precise_difference_to_now(datetime(2020, 1, 1, 12, 0, 0))
    {'years': 3, 'months': 6, 'days': 15, 'hours': 10, 'minutes': 45, 'seconds': 30}
    >>> precise_difference_to_now(date(2020, 1, 1))
    {'years': 3, 'months': 6, 'days': 15}
    """
    if isinstance(d, datetime):
        now = datetime.now()
    elif isinstance(d, date):
        now = date.today()
    else:
        raise TypeError("Expected datetime.date or datetime.datetime object.")

    delta = relativedelta(now, d)

    difference = {"years": delta.years, "months": delta.months, "days": delta.days}

    if isinstance(d, datetime):
        difference.update(
            {"hours": delta.hours, "minutes": delta.minutes, "seconds": delta.seconds}
        )

    return difference
