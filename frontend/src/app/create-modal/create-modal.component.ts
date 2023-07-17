import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Cookies from 'js-cookie';


@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss']
})
export class CreateModalComponent {
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<CreateModalComponent>) { }

  person: any = {}; // Object to store the person data

  onSubmit(form: NgForm) {
    if (form.invalid) {
        return;
    }

    const newPerson = {
      first_name: form.value.firstName,
      middle_name: form.value.middleName,
      last_name: form.value.lastName,
      birth_name: form.value.birthName,
      date_of_birth: form.value.dob,
      place_of_birth: form.value.pob,
      mother: form.value.mother,
      father: form.value.father
    };

    const csrftoken = Cookies.get('csrftoken');
    
    // Create the headers and include the CSRF token
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'X-CSRFToken': csrftoken || ''
      })
    };

    this.http.post('http://localhost:8000/api/person/', newPerson, httpOptions).subscribe(
        (response) => {
            console.log('Person created successfully!', response);
            form.resetForm(); // reset the form after successful submission
            // Add your own logic here for a successful form submission
        },
        (error) => {
            console.error('There was an error!', error);
            // Add your own logic here for handling errors
        }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
