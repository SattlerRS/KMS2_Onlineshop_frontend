import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(private http: HttpClient) { }

  private backendUrl = 'http://localhost:8080/api/newsletter';
  
  // Newsletter der ausgewählten Produkte per Mail versenden
  sendNewsletter(products: any) { 
      return this.http.post(this.backendUrl, products);
   }
}
