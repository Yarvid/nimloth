import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { IPerson } from '../models';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  allPersons: IPerson[] = [];
  errorMessage = '';
  isLoading = false;
  person: IPerson;

  constructor(
    private personService: PersonService,
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: IPerson },
  ) {
    this.person = { ...data.person };
  }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getAllPersons().subscribe({
      next: (persons) => {
        this.allPersons = persons.filter((p) => p.id !== this.person.id);
      },
      error: (error) => {
        console.error('Error loading persons:', error);
        this.errorMessage = 'Failed to load persons for parent selection';
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updatedPerson: IPerson = {
      id: this.person.id,
      first_name: form.value.firstName || '',
      middle_name: form.value.middleName || '',
      last_name: form.value.lastName || '',
      birth_name: form.value.birthName || '',
      artist_name: form.value.artistName || '',
      date_of_birth: form.value.dob || null,
      place_of_birth: form.value.pob || '',
      date_of_death: form.value.dod || null,
      place_of_death: form.value.pod || '',
      cause_of_death: form.value.cod || '',
      mother: form.value.mother ? Number(form.value.mother) : null,
      father: form.value.father ? Number(form.value.father) : null,
      gender: form.value.gender || 'U',
    };

    this.personService.updatePerson(this.person.id!, updatedPerson).subscribe({
      next: (response) => {
        console.log('Person updated successfully!', response);
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error updating person:', error);
        this.errorMessage =
          error.error?.detail || 'Failed to update person. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onDelete(): void {
    if (!confirm('Are you sure you want to delete this person?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.personService.deletePerson(this.person.id!).subscribe({
      next: () => {
        console.log('Person deleted successfully!');
        this.dialogRef.close({ deleted: true });
      },
      error: (error) => {
        console.error('Error deleting person:', error);
        this.errorMessage =
          error.error?.detail || 'Failed to delete person. Please try again.';
        this.isLoading = false;
      },
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
