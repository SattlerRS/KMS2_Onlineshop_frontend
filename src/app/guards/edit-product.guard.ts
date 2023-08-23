import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { ProductService } from './../_services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditProductGuard implements CanActivate {
  constructor(private router: Router,private token: TokenStorageService, private productService: ProductService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const User = this.token.getUser();
    return this.productService.getProductsForSeller(User.id).pipe(
      map((data: any) => {
        const id = route.params['productId'];
         
        if (data.products.some((product:any) => product.id == id)) {
        return true;
      } else {
        this.router.navigate(['/home']); // Weiterleitung zum Home-Router-Link
        return false;
      }
      }),
      catchError(error => {
        console.log(error.message);
        return of(false);
      })
    );
  }
}