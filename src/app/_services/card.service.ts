import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  private backendUrl = 'http://localhost:8080/api/card/';

  // Produkt in der Datenbank hinzufügen
  addToCard(quantity: number, userId: number, productId: number) {
      const payload = {
      quantity: quantity,
      userId: userId,
      productId: productId
  };
    return this.http.post(this.backendUrl + 'add', payload);
  }

  // Warenkorb für User aus der Datenbank abfragen
  getCardFromUser(userId: number): Observable<any> {
    const url = `${this.backendUrl}getCardForUser?userId=${userId}`;
    return this.http.get(url);
  }

  // Produkte vom Warenkorb abrufen
  getProductsFromCard(userId: number): Observable<any> {
    const url = `${this.backendUrl}getProductsFromCard?userId=${userId}`;
    return this.http.get(url);
  }

  // Produkt aus dem Warenkorb löschen
  delProductFromCard(cardId: number,productId: number, cardAmount:number): Observable<any> {
    const url = `${this.backendUrl}delProductFromCard?cardId=${cardId}&productId=${productId}&cardAmount=${cardAmount}`;
    return this.http.delete(url);
  }

  // Produktmenge im Warenkorb ändern
  changeCartAmount(productAmount: number, cardAmountOld: number, cardAmountNew: number, cardId:number,productId:number) {
      const payload = {
      productAmount: productAmount,
      cardAmountOld: cardAmountOld,
        cardAmountNew: cardAmountNew,
        cardId: cardId,
        productId:productId,
    };

    return this.http.post(this.backendUrl + 'changeCartAmount', payload);
  }
}
