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

  updatePerson(id: number, person: IPerson): Observable<IPerson> {
    return this.http.put<IPerson>(`${this.apiUrl}${id}/`, person).pipe(
      tap((updatedPerson) => {
        this.personCreatedSubject.next(updatedPerson);
      }),
    );
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      tap(() => {
        this.personCreatedSubject.next({} as IPerson);
      }),
    );
  }

  getCurrentUserPerson(): Observable<IPerson> {
    return this.http.get<IPerson>(`${this.apiUrl}me/`, { withCredentials: true });
  }
}
