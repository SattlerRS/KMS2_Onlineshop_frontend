import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { WatchlistService } from '../_services/watchlist.service';
import { CardService } from '../_services/card.service';
import { OrdersService } from '../_services/orders.service';
import { RefreshService } from '../_services/refresh.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  loggedIn: boolean = false;
  showUserContent: boolean = false;
  showSellerContent: boolean = false;
  showAdminContent: boolean = false;
  orders: any[] = [];
  watchlist: any[] = [];
  card: any[] = [];


  constructor(
    private tokenStorageService: TokenStorageService,
    private cardService: CardService,
    private ordersService: OrdersService,
    private watchlistService: WatchlistService,
    private refreshService: RefreshService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.refreshService.triggerRefresh();
    if (!(Object.keys(this.user).length === 0)) {
      if (this.user.roles[0] === 'USER') {
      this.loggedIn = true;
      this.showUserContent = true;
        this.loadOrdersFromDB();
        this.loadWatchlistFromDB();
        this.loadcardFromDB();
    }
    else if (this.user.roles[0] === 'SELLER') {
      this.loggedIn = true;
      this.showSellerContent = true;
    }
    else if (this.user.roles[0] === 'ADMIN') {
      this.loggedIn = true;
      this.showAdminContent = true;
    }    
    }
    
  }

  loadWatchlistFromDB() {
    this.watchlistService.getWatchlistForUser(this.user.id).subscribe({
      next: data => {
        this.watchlist = data;
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  loadcardFromDB() {
    if (this.showUserContent) {
      this.cardService.getCardFromUser(this.user.id).subscribe({
        next: data => {
          this.card = data;
        },
        error: err => {
          console.log(err.message);
        }
      });
    }
  }

  loadOrdersFromDB() {
    this.ordersService.getOrdersFromUser(this.user.id).subscribe({
      next: data => {
        this.orders = data.orders;
      },
      error: err => {
        console.log(err.message);
      }
    });
  }
}
