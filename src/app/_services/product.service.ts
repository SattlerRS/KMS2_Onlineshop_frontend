import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private backendUrl = 'http://localhost:8080/api/products/';

  constructor(private http: HttpClient) { }

  // Produkt hinzufügen
  addProduct(formdata: any, imgfiles: File[]) {
    const formData = new FormData();
    formData.append('formData', JSON.stringify(formdata));
    for (let i = 0; i < imgfiles.length; i++) {
      formData.append('imgFiles', imgfiles[i]);
    }

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    const options = { headers: headers }; // Optionen für den HTTP-Post-Anruf

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.http.post(this.backendUrl + 'add', formData, options);
  }

  // alle Produkte abrufen
  getProducts(): Observable<any> {
    
    return this.http.get(this.backendUrl + 'getAll');
  }

  // Produkte für Verkäufer abrufen
  getProductsForSeller(sellerId: string): Observable<any> {
    const url = this.backendUrl + 'getProductForSeller/' + sellerId;
    return this.http.get(url);
  }
  
  // Produtkt löschen
  deleteProduct(productId: string, productImgstring:string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        productId: productId,
        productImgString: productImgstring
      }
    };

    return this.http.delete(this.backendUrl + 'delete', httpOptions);
  }
  
  // Produkt ändern
  changeProduct(formdata: any, imgfiles: File[]) {
    for (let i = 0; i < imgfiles.length; i++) {
      
      if (imgfiles[i].name === "Placeholder" || imgfiles[i].name.includes("Placeholder.")) {
        imgfiles.splice(i, 1);
        i--;
      }
    }

    const formData = new FormData();
    formData.append('formData', JSON.stringify(formdata));
    for (let i = 0; i < imgfiles.length; i++) {
      formData.append('imgFiles', imgfiles[i]);
    }

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    const options = { headers: headers };

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.http.post(this.backendUrl + 'change', formData, options);
  }

  // Einzelnes Produkt abfragen
  getProduct(productId: string): Observable<any> {
      const url = this.backendUrl + 'getProduct/' + productId;
      return this.http.get(url);
    }
  
  // Nicht geprüfte Produkte laden
  getProductsForAdminBoards(proofed : number): Observable<any> {
      return this.http.get(this.backendUrl + 'getProductsForAdmin/' + proofed);
  }
  // Einzelnes Produkt freigeben
  releaseProduct(productId: string): Observable<any> {
    const url = this.backendUrl + 'releaseProduct';
    return this.http.post(url, { productId });
  }

  // Einzelnes Produkt sperren
  lockProduct(productId: string): Observable<any> {
    const url = this.backendUrl + 'lockProduct';
    return this.http.post(url, { productId });
  }
  
  // Alle Produkte freigeben
  releaseAllProducts(products: any): Observable<any> {
    const url = this.backendUrl + 'releaseAll';
    return this.http.post(url, { products });
  }
  
    // Alle Produkte sperren
  lockAllProducts(products: any): Observable<any> {
    const url = this.backendUrl + 'lockAll';
    return this.http.post(url, { products });
  }
}