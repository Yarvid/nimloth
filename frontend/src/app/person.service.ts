import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPerson } from './models';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = 'http://localhost:8000/api/person/';
  private personCreatedSubject = new Subject<IPerson>();

  personCreated$ = this.personCreatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPersons(): Observable<IPerson[]> {
    return this.http.get<IPerson[]>(this.apiUrl);
  }

  createPerson(person: IPerson): Observable<IPerson> {
    return this.http.post<IPerson>(this.apiUrl, person).pipe(
      tap((createdPerson) => {
        this.personCreatedSubject.next(createdPerson);
      }),
    );
  }
}
