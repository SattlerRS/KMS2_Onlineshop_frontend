import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../_services/orders.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  user: any;
  orders: any[] = [];
  orderdetails: any;
  showdetails: boolean = false;
  filteredlist: any;
  selectedOrderId: any;
  totalcosts: number = 0;
  totalamount: number = 0;
  p: any;

  constructor(private ordersService:OrdersService, private token:TokenStorageService) { }

  ngOnInit(): void {
    this.user = this.token.getUser();

    // Bestellungen für den User abfragen
    this.ordersService.getOrdersFromUser(this.user.id).subscribe({
      next: data => {
        this.orders = data.orders;
        this.orders.sort((a:any, b:any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        this.orderdetails = data.orderDetails;
      },
      error: err => {
        console.log(err.message);
      }
    });
  }
  //Datum und Uhrzeit formattieren
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
  }

  // Gesamtmenge erhalten
  getTotalAmount() {
      this.totalamount = 0;
      this.filteredlist.forEach((product: any) => {
        this.totalamount += product.amount;
    });
  }

   // Gesamtpreis erhalten
  getTotalCosts() {
      this.totalcosts = 0;
      this.filteredlist.forEach((product: any) => {
      this.totalcosts += (product.price * product.amount);
    });
  }

  // Zeigt Bestellinformationen an
  onOrderClick(order: any) {
    this.showdetails = true;
    this.selectedOrderId = order.id;
    this.filteredlist = this.orderdetails.filter((item: any) => item.orderid === order.id);
    this.getTotalAmount();
    this.getTotalCosts();
  }
}
