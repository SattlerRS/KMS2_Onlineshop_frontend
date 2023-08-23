import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  private backendUrl = 'http://localhost:8080/api/rating/';

  // Bewertungen für Produkt abrufen
  getRatingsForProduct(productId: string): Observable<any> {
    const url = this.backendUrl + 'getRatingsForProduct/' + productId;
    return this.http.get(url);
  }
  
  // Bewertung hinzufügen
  addRating(rating: any) { 
    return this.http.post(this.backendUrl + 'addRating', rating);
  }
}
