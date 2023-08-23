import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { CardService } from '../../_services/card.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import { AppComponent } from '../../app.component';
import { CheckoutService } from '../../_services/checkout.service';
import { PaymentService } from '../../_services/payment.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  account: any = {
  userid: '',
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  postalCode: '',
  email:'',
  birthdate: '',
  phoneNumber: ''
};
  user: any;
  card: any;
  productAmount: number = 0;
  totalPrice: number = 0;
  progress: number = 33.33;
  saveData: boolean = true;
  paymentMethod: any;
  showPaymentError: boolean = false;
  agbAccepted: boolean = false;
  newProductAmountOfCard: number = 0;
  showsuccess: boolean = false;
  orderid: any;

  paymentHandler: any = null;
  showAgbError: boolean = false;

  showOrderDetailsError = false;

  paymentId: any;
  payer_id: any;


  constructor(
    private tokenStorageService: TokenStorageService,
    private cardService: CardService,
    private router: Router,
    private profilservice: ProfileService,
    private appcomponent: AppComponent,
    private checkoutservice: CheckoutService,
    private paymentService: PaymentService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    //Paypal Transaktion OK
    this.route.queryParams.subscribe(params => {
      if (params['paypal'] == 'proofed') {
        this.progress = 100;
        this.paymentMethod = 'paypal';
        this.payer_id = params['PayerID'];
        this.paymentId = params['paymentId'];
      }
    });

    // Werte beim neuladen zurücksetzen
    this.totalPrice = 0;
    this.productAmount = 0;
    this.newProductAmountOfCard = 0;
    this.showAgbError = false;
    this.showOrderDetailsError = false;

    // User abfragen
    this.user = this.tokenStorageService.getUser();

    // Produkte vom Warenkorb abfragen
    this.cardService.getProductsFromCard(this.user.id).subscribe({
      next: data => {
        this.card = data;
        this.getProductAmountNumber();
        this.getTotalPrice();
        this.invokeStripe();
        },
        error: err => {
          console.log(err.message);
        }
      });

    // Versanddaten für User abfragen
    this.profilservice.getProfileFromUser(this.user.id).subscribe({
          next: data => {
            this.account = data;
            this.account.birthdate = this.birthdayformatter();
        },
        error: err => {
          console.log(err.message);
        } 
      });
  }

  // Formattiert das Geburtsdatum für das Inputfeld
  birthdayformatter() {
    const birthdate = new Date(this.account.birthdate);
    const year = birthdate.getFullYear();
    let month = (birthdate.getMonth() + 1).toString().padStart(2, '0');
    let day = birthdate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Anzahl Produkte im Warenkorb
  getProductAmountNumber() {
    this.card.cards.forEach((item: any) => {

      this.productAmount += item.amount;
    });
  }

  // Kompletter Preis der Waren im Warenkorb
  getTotalPrice() {
    this.card.cards.forEach((item: any) => {

      this.totalPrice += item.amount * item.product.productprice * 1.0;
    });
  }
  // Zurück Button
  goBack() {
    if (this.progress == 33.33 ) {
      this.router.navigate(['/card']);
    }
    else if(this.progress == 100){
      this.progress -= 33.34;
    }
    else {
      this.progress -= 33.33;
    }
  }
  // Weiter Button
  goForward() {
    if (this.progress === 33.33 && this.isFormValid()) {
      this.progress += 33.33;
      this.showOrderDetailsError = false;

      //Checkbox ob Versanddetails gespeichert werden sollen
      if (this.saveData === true) {
        this.account.userid = this.user.id;
        this.account.email = this.user.email;

        // Userdaten im Backend updaten
        this.profilservice.updateUserData(this.account).subscribe({
          next: (response: Object) => {
            console.log(response);
          },
          error: (error: any) => {
            console.error('Fehler beim Updaten der Profildaten', error);
          }
        });
      }
    }
    else if (this.progress === 66.66) {
      if (this.paymentMethod) {
        if (this.paymentMethod === 'paypal') {
          this.proofPaypal();
        }
        else {
          this.showPaymentError = false;
          this.progress += 33.34;
        }
        
      }
      else {
        this.showPaymentError = true;
      }
    }
    else {
      this.showOrderDetailsError = true;
    }
  }

  // Eingaben der Versandaten überprüfen
  isFormValid(): boolean {
    return (
      this.account.firstName &&
      this.account.lastName &&
      this.account.street &&
      this.account.city &&
      this.account.postalCode &&
      this.account.birthdate &&
      this.account.phoneNumber
    )
  }

  // Zurück zu Versanddetails
  goToShippingDetails() {
    this.progress = 33.33;
  }

  // Produkt aus Warenkorb löschen
  delFromCard(item: any) {
    this.cardService.delProductFromCard(item.id,item.product.id,item.amount).subscribe({
      next: data => {
        console.log(data);
        this.appcomponent.ngOnInit();
        this.ngOnInit();
        },
        error: err => {
          console.log(err.message);
        }
      });
  }

  // Produktmenge im Warenkorb ändern
  onQuantityChange(event: any, item: any) {
    this.cardService.changeCartAmount(item.product.productamount,item.amount,event.target.value, item.id,item.product.id).subscribe({
      next: data => {       
        console.log(data);
        this.appcomponent.ngOnInit();
        this.ngOnInit();
        },
        error: err => {
          console.log(err.message);
        }
      });
  }

  // Optionen für Mengenauswahlfeld generieren
  generateQuantityOptions(item: any) {
    const maxQuantity = item.product.productamount + item.amount;
    const options = [];

    for (let i = 1; i <= maxQuantity; i++) {
      options.push(i);
    }
    return options;
  }

  // Bestellabwicklung
  orderProducts() {
    if (this.agbAccepted) {

      //mit Stripe
      if (this.paymentMethod === 'creditCard') {
        const paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51NQSMoAYAs8K8FsBMRQoCVaT26bwXo3ES2yvElQYFiJQ0KyUxIN8A18US9ZNPdmQO5UbCdaTwk4vWQUZnbb5NcnH005AOOZJ7j',
          locale: 'auto',
          token: function (stripeToken: any) {
            paymentStripe(stripeToken);
          },
          currency: 'eur'
        });

        const paymentStripe = (stripeToken: any) => {
          console.log(stripeToken);
          this.paymentService.makePayment(stripeToken, this.totalPrice).subscribe((data: any) => {
            this.checkoutservice.addOrdersAndDeleteCard(this.totalPrice,this.user.id,this.card ).subscribe({
            next: (data: any) => {    
              this.showsuccess = true;
              this.appcomponent.ngOnInit();
              this.orderid = data.order;
              },
              error: err => {
                console.log(err.message);
                }
            });
          })
        }
        paymentHandler.open({
          name: "Bezahlung",
          description: "Mit Kreditkarte",
          amount: this.totalPrice * 100,
        }) 
      } 
      // mit Paypal
      else if (this.paymentMethod === 'paypal') {
        this.executePaypal();
      }
    }

    else {
      this.showAgbError = true;
    }
  }

  // Bezahlung Stripe
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js'
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51NQSMoAYAs8K8FsBMRQoCVaT26bwXo3ES2yvElQYFiJQ0KyUxIN8A18US9ZNPdmQO5UbCdaTwk4vWQUZnbb5NcnH005AOOZJ7j',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  // Bezahlung Paypal überprüfen
  proofPaypal() {
    this.paymentService.makePaymentPaypal(this.totalPrice).subscribe({
      next: (data:any) => {       

      const approvalUrl = data.approvalUrl;
    // Führe die Weiterleitung zur Approval-URL durch oder verwende sie anderweitig
      window.location.href = approvalUrl;

        },
        error: err => {
          console.log(err.message);
        }
    });
  }

  // Paypal Zahlung durchführen
  executePaypal() {
    this.paymentService.executePaymentPaypal(this.paymentId,this.payer_id).subscribe({
      next: (data:any) => {       
        this.checkoutservice.addOrdersAndDeleteCard(this.totalPrice,this.user.id,this.card ).subscribe({
          next: (data: any) => {    
            this.showsuccess = true;
            this.appcomponent.ngOnInit();
            this.orderid = data.order;
            },
            error: err => {
              console.log(err.message);
              }
          });
        },
        error: err => {
          console.log(err.message);
        }
    });
  }
}
