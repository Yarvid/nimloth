import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser, IAuthResponse, ILoginResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private currentUserSubject: BehaviorSubject<IUser | null>;
  public currentUser: Observable<IUser | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.checkAuth().subscribe();
  }

  public get currentUserValue(): IUser | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(
        `${this.apiUrl}/login/`,
        { username, password },
        { withCredentials: true },
      )
      .pipe(
        tap((response) => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        }),
      );
  }

  logout(): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{
        success: boolean;
        message: string;
      }>(`${this.apiUrl}/logout/`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        }),
      );
  }

  checkAuth(): Observable<IAuthResponse> {
    return this.http
      .get<IAuthResponse>(`${this.apiUrl}/check/`, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response.authenticated && response.user) {
            this.currentUserSubject.next(response.user);
          } else {
            this.currentUserSubject.next(null);
          }
        }),
      );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
