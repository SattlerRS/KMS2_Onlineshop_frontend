import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  // Email verifizierung
  emailVerification(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'emailVerification', {
      email,
    }, httpOptions);
  }

  // Login
  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  // Registrieren als User
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  // Registrieren als Verkäufer
  register_as_seller(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup_as_seller', {
      username,
      email,
      password
    }, httpOptions);
  }

  // Passwort zurücksetzen
  resetPassword(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'resetPassword', {
      email,
    }, httpOptions);
  }

  // Passwort zrücksetzen mit Token
  resetPasswordWithToken(token: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'resetPasswordNewPasswort', {
      token, password
    }, httpOptions);
  }

  // Passwort zurücksetzen Token überprüfen ob noch gültig und vorhanden
  checkResetTokenValidity(token: string): Observable<any> {
    return this.http.get(AUTH_API + 'checkResetTokenValidity/' + token);
  }

  // Passwort in der Datenbank ändern
  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string, userid: string): Observable<any> {
    return this.http.post(AUTH_API + 'changePasswordForUser', {
      currentPassword, newPassword, confirmNewPassword, userid
    }, httpOptions);
  }
}
