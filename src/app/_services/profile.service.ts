import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

private backendUrl = 'http://localhost:8080/api/profile/';

  constructor(private http: HttpClient) { }

  // Profildaten von Veräufer abrufen
  getProfileFromSeller(sellerId: string): Observable<any> {
    const url = this.backendUrl + 'getProfileForSeller/' + sellerId;
    return this.http.get(url);
  }
  // Verkäuferdaten updaten
  updateSellerData(sellerData: any, imgFile:File): Observable<any> {
    const url = `${this.backendUrl}updateSeller`;
    const formData = new FormData();
    // Hinzufügen der Verkäuferdaten zum FormData-Objekt
    formData.append('sellerData', JSON.stringify(sellerData));
    if (imgFile != null) {
      // Hinzufügen des Bildes zum FormData-Objekt
      formData.append('image', imgFile, imgFile.name);
    }
    // Senden der Anfrage mit FormData als Daten
    return this.http.post(url, formData);
  }
  
  
  // Userdaten abfragen
  getProfileFromUser(userId: string): Observable<any> {
    const url = this.backendUrl + 'getProfileForUser/' + userId;
    return this.http.get(url);
  }
  // Userdaten updaten
  updateUserData(userData: any): Observable<any> {
      const url = `${this.backendUrl}updateUser`;
    
      // Senden der Anfrage mit FormData als Daten
      return this.http.post(url, userData);
  }
  
  // Userdaten mit Image ändern
  updateUserDataWithImage(userData: any, imgFile:File): Observable<any> {
    const url = `${this.backendUrl}updateUserWithImage`;
    const formData = new FormData();
    // Hinzufügen der Verkäuferdaten zum FormData-Objekt
    formData.append('userData', JSON.stringify(userData));
    if (imgFile != null) {
      // Hinzufügen des Bildes zum FormData-Objekt
      formData.append('image', imgFile, imgFile.name);
    }
    // Senden der Anfrage mit FormData als Daten
    return this.http.post(url, formData);
  }
}
