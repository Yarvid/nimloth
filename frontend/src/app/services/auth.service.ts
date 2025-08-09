import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.loadUserProfile();
        }),
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post(`${this.apiUrl}/logout/`, { refresh_token: refreshToken })
      .pipe(
        tap(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.currentUserSubject.next(null);
        }),
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post(`${this.apiUrl}/login/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access);
        }),
      );
  }

  loadUserProfile(): void {
    this.http.get<UserResponse>(`${this.apiUrl}/user/`).subscribe(
      (user) => this.currentUserSubject.next(user),
      (error) => console.error('Error loading user profile:', error),
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password/`, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset/`, { email });
  }

  confirmPasswordReset(
    uidb64: string,
    token: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/password-reset-confirm/${uidb64}/${token}/`,
      {
        new_password: newPassword,
      },
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private checkToken(): void {
    if (this.isLoggedIn()) {
      this.loadUserProfile();
    }
  }
}
