import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import { ProductService } from '../../_services/product.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Router } from '@angular/router';
import { WatchlistService } from '../../_services/watchlist.service';
import { AppComponent } from '../../app.component';
import { CardService } from '../../_services/card.service'

@Component({
  selector: 'app-show-seller',
  templateUrl: './show-seller.component.html',
  styleUrls: ['./show-seller.component.css']
})
export class ShowSellerComponent implements OnInit {
  sellerId: any;
  seller: any = {};
  sellerdetails: any = {};
  user: any;
  products: any[] = [];
  watchlist: any[] = []
  showAmountBtn: any;
  showZeroAmountProducts = false;
  p: any;
  showCardBanner: boolean = false;
  productCardBanner: string = '';
  showWatchlistBanner: boolean = false;
  productWatchlistBanner: string ='';


  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private productService: ProductService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private watchlistService: WatchlistService,
    private appComponent: AppComponent,
    private cardService: CardService) { }

  ngOnInit(): void {
    // User aus der dem Sessionspeicher abrufen
    this.user = this.tokenStorageService.getUser();
    // Verkäufer ID aus dem Router Endpunkt abfragen
    this.route.params.subscribe(params => {
      this.sellerId = params['sellerId'];

      // Profildaten des Verkäufers abfragen
      this.profileService.getProfileFromSeller(this.sellerId).subscribe({
        next: data => {
          this.seller = data.user;
          this.sellerdetails = data.seller;
        },
        error: err => {
          if (err.status === 404) {
            // Weiterleitung zur Home-Seite
            this.router.navigate(['/home']);
          } else {
            console.log(err.message);
          }
        }
      });
    });

    // Produte des Verkäufers abfragen
    this.productService.getProductsForSeller(this.sellerId).subscribe({
      next: data => {      
        this.products = this.processProductsData(data.products); // Speichern der Produktinformationen im Array
        // Produkte löschen die einen Lagerstand von 0 haben
        this.products = this.products.filter(product => product.productamount > 0);
      },
      error: err => {
        console.log(err.message);
      }
    });

    // Merkliste des Users abfragen
    this.watchlistService.getWatchlistForUser(this.user.id).subscribe({
      next: data => {
        this.watchlist = data;
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Produktbilder in ein Array umwandeln
  processProductsData(products: any[]): any[] {
    return products.map((product: any) => {
      const imagesArray: string[] = product.images.split(',').map((imageUrl: string) => imageUrl.trim());
      return { ...product, images: imagesArray };
    });
  }

  //Datum und Uhrzeit formattieren
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return formattedDate + ' ' + formattedTime;
  }


  // Produkt zum Warenkorb hinzufügen
  addProductToCard(product: any) {
    this.cardService.addToCard(1, this.user.id, product.id).subscribe({
      next: data => {
        this.ngOnInit();
        this.appComponent.ngOnInit();
        this.showWatchlistBanner = false;
        this.productCardBanner = product.productname;
        this.showCardBanner = true; 
        setTimeout(() => {
          this.showCardBanner = false;
        }, 5000);
      },
      error: err => {
        console.log(err.message);
      }
    }); 
  }

  // Produkt zur Merkliste hinzufügen
  addToWatchlist(product: any) {
    this.watchlistService.addProductToWatchlist(this.user.id, product.id).subscribe({
      next: data => {
        this.ngOnInit();
        this.appComponent.ngOnInit();
        this.showCardBanner = false;
        this.productWatchlistBanner = product.productname;
        this.showWatchlistBanner = true; 
        setTimeout(() => {
          this.showWatchlistBanner = false;
        }, 5000);
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Prüfen ob Produkt bereits in der Merkliste ist
  isInWatchlist(product: any): boolean {
    return this.watchlist.some(item => item.product.id === product.id); 
  }

  // Wechseln auf ShowProduct Komponente
  showProduct(product: any) {
    const productId = product.id; // Annahme, dass das Produkt eine ID hat
    this.router.navigate(['showProduct', productId])
  }
}
