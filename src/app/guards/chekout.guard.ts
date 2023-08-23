import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { CardService } from '../_services/card.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
    constructor(
        private router: Router,
        private token: TokenStorageService,
        private cardservice : CardService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user = this.token.getUser();
    return this.cardservice.getCardFromUser(user.id).pipe(
      map((data: any) => {
        console.log(data);
          const isEmpty = data.length === 0;
        if (isEmpty) {
          this.router.navigate(['/home']); // Weiterleitung zur Warenkorbseite
        }
        return !isEmpty; // Erlaube Zugriff, wenn der Warenkorb nicht leer ist
      }),
      catchError(error => {
        console.log(error.message);
        return of(false);
      })
    );
  }
}