import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { IPerson } from '../models';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  allPersons: IPerson[] = [];
  errorMessage = '';
  isLoading = false;
  createAccount = false;

  constructor(
    private personService: PersonService,
    public dialogRef: MatDialogRef<CreateModalComponent>,
  ) {}

  person: IPerson = {
    first_name: '',
    middle_name: '',
    last_name: '',
    birth_name: '',
    artist_name: '',
    date_of_birth: null,
    place_of_birth: '',
    date_of_death: null,
    place_of_death: '',
    cause_of_death: '',
    mother: null,
    father: null,
    gender: 'U',
    user_account: null,
  };

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getAllPersons().subscribe({
      next: (persons) => {
        this.allPersons = persons;
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

    const newPerson: IPerson = {
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

    // Add user account if checkbox is checked
    if (this.createAccount) {
      newPerson.user_account = {
        username: form.value.username || '',
        email: form.value.email || '',
        first_name: form.value.firstName || '',
        last_name: form.value.lastName || '',
        password: form.value.password || '',
      };
    }

    this.personService.createPerson(newPerson).subscribe({
      next: (response) => {
        console.log('Person created successfully!', response);
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error creating person:', error);
        this.errorMessage =
          error.error?.detail || 'Failed to create person. Please try again.';
        this.isLoading = false;
      },
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
