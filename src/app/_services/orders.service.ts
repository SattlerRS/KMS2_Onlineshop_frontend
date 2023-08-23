import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  private backendUrl = 'http://localhost:8080/api/orders/';

  // Bestellungen für User abfragen
  getOrdersFromUser(userId: string): Observable<any> {
      const url = this.backendUrl + 'getAll/' + userId;
      return this.http.get(url);
  }
  
  // Bestellungen für Seller abfragen
  getOrdersFromSeller(sellerId: string): Observable<any> {
      const url = this.backendUrl + 'getAllForSeller/' + sellerId;
      return this.http.get(url);
  }

  // Bestellstatus für Bestellung ändern
  changeOrderStatus(Id:string, status:string) { 
    const payload = {
        Id: Id,
        status: status,
    };
    return this.http.post(this.backendUrl + 'changeOrderStatus', payload);
  }
}
