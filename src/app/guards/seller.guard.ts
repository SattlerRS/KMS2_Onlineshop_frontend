import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SellerGuard implements CanActivate {
  constructor(private router: Router,private token: TokenStorageService,) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Prüfe die Benutzerrolle im Session Storage
      const User = this.token.getUser();

    // Überprüfe die Benutzerrolle und gewähre oder verweigere den Zugriff
    if (User && User.roles && User.roles[0] === 'SELLER') {
      return true; // Zugriff erlaubt
    } else {
      // Benutzerrolle ist nicht admin, leite auf eine andere Seite weiter oder zeige eine Fehlermeldung an
        this.router.navigate(['/home']);
      return false; // Zugriff verweigert
    }
  }
}