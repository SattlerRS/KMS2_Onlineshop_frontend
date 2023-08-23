import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  // Bezahlung mit Stripe durchführen
  makePayment(stripeToken: any,amount: number):Observable<any> {
    const url = "http://localhost:8080/checkout";
      return this.http.post<any>(url, { token: stripeToken, amount:amount });
  }

  // Bezhalung über Paypal überprüfen
  makePaymentPaypal(payment:number) {
    const url = "http://localhost:8080/paypal/proof";
      return this.http.post(url, { payment: payment});
  }

  // Bezahlung über Paypal durchführen
  executePaymentPaypal(paymentId:any, payerId:any) {
    const url = "http://localhost:8080/paypal/execute";
      return this.http.post(url, { paymentId: paymentId, payerId:payerId  });
  }
}
