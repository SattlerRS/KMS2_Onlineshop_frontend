import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ProductService } from './../_services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowProductGuard implements CanActivate {
  constructor(private router: Router, private productService: ProductService) { }
  products: any;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.productService.getProducts().pipe(
      map((data: any) => {
        const id = route.params['productId'];
        console.log(data.products);

          
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