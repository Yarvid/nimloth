import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPerson } from './models';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = 'http://localhost:8000/api/person/';

  constructor(private http: HttpClient) {}

  getAllPersons(): Observable<IPerson[]> {
    return this.http.get<IPerson[]>(this.apiUrl);
  }
}
