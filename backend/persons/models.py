from django.db import models

class Person(models.Model):
    # --- Names ---
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    birth_name = models.CharField(max_length=50)
    artist_name = models.CharField(max_length=50)
    # --- Birth --- 
    date_of_birth = models.DateField()
    place_of_birth = models.CharField(max_length=100)
    # --- Death --- 
    date_of_death = models.DateField()
    place_of_death = models.CharField(max_length=100)
    cause_of_death = models.CharField(max_length=100)
    # --- Relationship ---
    mother = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='mother_of',
    )
    father = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='father_of',
    )
    # --- Other ---
    gender = models.CharField(
        max_length=1,
        choices=[
        ('M', 'Male'),
        ('F', 'Female'),
        ('N', 'Non-Binary'),
        ('U', 'Unspecified'),
    ],
        default='U')
    # --- Modifictation log ---
    created_on = models.DateField(auto_now_add=True)
    modified_on = models.DateField(auto_now=True)
    created_by = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='created_persons',
    )
    modified_by = created_by = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='modified_persons',
    )