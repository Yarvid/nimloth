# admin.py
from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'middle_name', 'last_name', 'date_of_birth', 'gender')
    list_filter = ('gender', 'created_on', 'modified_on')
    search_fields = ('first_name', 'middle_name', 'last_name', 'birth_name')
    readonly_fields = ('created_on', 'modified_on')
    fieldsets = (
        ('Names', {
            'fields': ('first_name', 'middle_name', 'last_name', 'birth_name', 'artist_name')
        }),
        ('Birth & Death', {
            'fields': (
                ('date_of_birth', 'place_of_birth'),
                ('date_of_death', 'place_of_death', 'cause_of_death')
            )
        }),
        ('Relationships', {
            'fields': ('mother', 'father')
        }),
        ('Other Information', {
            'fields': ('gender',)
        }),
        ('Modification History', {
            'fields': ('created_on', 'modified_on', 'created_by', 'modified_by'),
            'classes': ('collapse',)
        })
    )