import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  // Ausloggen und Sessionstorage löschen
  signOut(): void {
    window.sessionStorage.clear();
  }

  // Token in den Sessionstorage speichern
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  // Token aus dem Sessionstorage auslesen
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  // User in den Sessionstorage speichern
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));

  }

  // User aus dem Sessionstorage auslesen
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
