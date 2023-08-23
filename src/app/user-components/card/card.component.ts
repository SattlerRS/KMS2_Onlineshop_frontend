import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { CardService } from '../../_services/card.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  user: any;
  card: any;
  productAmount: number = 0;
  totalPrice: number = 0;
  newProductAmountOfCard: number = 0;
  p: any;

  constructor(
    private tokenStorageService: TokenStorageService,
    private cardService: CardService,
    private router: Router,
    private appComponent: AppComponent,) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();

    // Produkte vom Warenkorb abrufen
    this.cardService.getProductsFromCard(this.user.id).subscribe({
      next: data => {
        this.card = data;
        this.getProductAmountNumber();
        this.getTotalPrice();
        if (this.card.cards < 1) {
          location.reload();
        }
        },
        error: err => {
          console.log(err.message);
        }
      });
  }

  // Produktmenge im Warenkorb ermitteln
  getProductAmountNumber() {
    this.productAmount = 0;
    this.card.cards.forEach((item: any) => {

      this.productAmount+= item.amount;
    });
  }

  // Gesamtpreis im Warenkorb ermitteln
  getTotalPrice() {
    this.totalPrice = 0;
    this.card.cards.forEach((item: any) => {

      this.totalPrice += item.amount * item.product.productprice * 1.0;
    });
  }

  // Produktmengen für die Inputfelder generieren
  generateQuantityOptions(item: any) {
    const maxQuantity = item.product.productamount + item.amount;
    const options = [];

    for (let i = 1; i <= maxQuantity; i++) {
      options.push(i);
    }

    return options;
  }
  
  // Produkt aus dem Warenkorb entfernen
  removeFromCart(item: any) {
    this.cardService.delProductFromCard(item.id,item.product.id,item.amount).subscribe({
      next: data => {
        this.ngOnInit();
        this.appComponent.ngOnInit();
      },
        error: err => {
          console.log(err.message);
        }
      });
  }

  // Mengenhandler für Mengenänderungen im Warenkorb
  onQuantityChange(event: any, item: any) {
    this.cardService.changeCartAmount(item.product.productamount,item.amount,event.target.value, item.id,item.product.id).subscribe({
      next: data => {       
        console.log(data);
        this.ngOnInit();
        this.appComponent.ngOnInit();
        this.newProductAmountOfCard = 0;
        },
        error: err => {
          console.log(err.message);
        }
      });

  }

  // Zur Komponenten Checkout wechseln
  checkout() {
    this.router.navigate(['/checkout']);
  }
}
