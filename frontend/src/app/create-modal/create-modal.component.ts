import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss']
})
export class CreateModalComponent {
  constructor(private http: HttpClient) { }

  person: any = {}; // Object to store the person data

  //@Output() createPerson: EventEmitter<any> = new EventEmitter();

  onSubmit(form: NgForm) {
    if (form.invalid) {
        return;
    }

    const newPerson = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        dob: form.value.dob,
        pob: form.value.pob,
        mother: form.value.mother,
        father: form.value.father
    };

    this.http.post('http://localhost:8000/api/person/', newPerson).subscribe(
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
    // Add your logic to close the modal
  }
}
