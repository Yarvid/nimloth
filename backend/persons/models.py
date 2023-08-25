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
    created_on = models.DateField(auto_now_add=True, null=True)
    modified_on = models.DateField(auto_now=True, null=True)
    created_by = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='created_persons',
    )
    modified_by = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        related_name='modified_persons',
    )

    def full_name(self):
        return ' '.join([name for name in [self.first_name, self.middle_name, self.last_name] if name])

    def age(self):
        if self.date_of_birth is None:
            return None
        else:
            today = datetime.today()
            age = today - self.date_of_birth

            years = age.days // 365
            remaining_days = age.days % 365
            months = remaining_days // 30
            days = remaining_days % 30
            
            return years, months, days
    