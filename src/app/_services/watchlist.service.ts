import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(private http: HttpClient) { }

  private backendUrl = 'http://localhost:8080/api/watchlist/';

  // Merkliste für User abfragen
  getWatchlistForUser(userId: string): Observable<any> {
    const url = this.backendUrl + 'getWatchlistForUser/' + userId;
    return this.http.get(url);
  }
  
  // Produkt zur Merkliste des Users hinzufügen
  addProductToWatchlist(userId:string, productId:string) { 
    const payload = {
        userId: userId,
        productId: productId,
    };

    return this.http.post(this.backendUrl + 'addProductToWatchlist', payload);
  }

  // Produkt von Merkliste des Users löschen
  removeFromWatchlist(id: string): Observable<any> {
    const url = this.backendUrl + 'removeFromWatchlist/' + id;
    return this.http.delete(url);
  }
}
