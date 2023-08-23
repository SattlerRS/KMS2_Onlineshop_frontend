import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }

  private backendUrl = 'http://localhost:8080/api/checkout/';

  // Warenkorb zu den Bestellungen hinzufügen und den Warenkorb löschen
  addOrdersAndDeleteCard(totalprice: number, userid: number, card: any) {
      const payload = {
        totalprice: totalprice,
        userid: userid,
        card: card,
    };

    return this.http.post(this.backendUrl + 'addOrdersDeleteCard', payload);
  }
}
