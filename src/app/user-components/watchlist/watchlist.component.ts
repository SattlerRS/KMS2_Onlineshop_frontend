import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../../_services/watchlist.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AppComponent } from '../../app.component';
import { CardService } from '../../_services/card.service'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  watchlist: any[] = [];
  user: any;

  constructor(
    private watchlistService: WatchlistService,
    private tokenStorageService: TokenStorageService,
    private appComponent: AppComponent,
    private cardService: CardService) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();

    // Merkliste des Users von der DB einlesen
    this.watchlistService.getWatchlistForUser(this.user.id).subscribe({
      next: data => {
        this.watchlist = data;
        if (this.watchlist.length === 0) {
          location.reload();
        }
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Produkt von der Merkliste entfernen
  removeFromWatchlist(item: any) {
    this.watchlistService.removeFromWatchlist(item.id).subscribe({
      next: data => {
        console.log(data);
        this.ngOnInit();
        this.appComponent.ngOnInit();
      },
      error: err => {
        console.log(err.message);
      }
    });
  }
  
  // Produkt von der Merkliste entfernen und zum Warenkorb hinzufügen
  addToCart(item: any) {
    this.cardService.addToCard(1,this.user.id,item.productid).subscribe({
      next: data => {
        this.removeFromWatchlist(item);
        this.ngOnInit();
        this.appComponent.ngOnInit();
      },
      error: err => {
        console.log(err.message);
      }
    });
  }
}
