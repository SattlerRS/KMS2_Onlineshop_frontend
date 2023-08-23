import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ProductService } from '../../_services/product.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { CardService } from '../../_services/card.service';
import { RatingService } from '../../_services/ratings.service';
import { AppComponent } from '../../app.component';
import { ViewportScroller } from '@angular/common';
import { WatchlistService } from '../../_services/watchlist.service';



@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {
  productId: any;
  product: any = {};
  startImage: any;
  selectedQuantity: number = 0;
  currentUser: any;
  isAddedToCart: boolean = false;
  showSuccessMessage: boolean = false;
  showSuccessMessageWatchlist: boolean = false;
  ratings: any[] = [];
  watchlist: any[] = [];
  showRatingBtn: boolean = true;
  showAddRating: boolean = false;
  showAddRatingError: boolean = false;

  
  p: any;
  sellerdetails: any = {};

  userRating: any = {
    userid: '',
    productid: '',
    rating: '',
    header: '',
    text: '',
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private token: TokenStorageService,
    private cardService: CardService,
    private appComponent: AppComponent,
    private ratingService: RatingService,
    private viewportScroller: ViewportScroller,
    private watchlistService: WatchlistService,
  ) {}

  ngOnInit(): void {
    this.showAddRatingError = false;
    this.currentUser = this.token.getUser();
    this.route.params.subscribe(params => {
      this.productId = params['productId'];
    });

    // Produkt von der DB abrufen
    this.productService.getProduct(this.productId).subscribe({
        next: data => {
          this.product = this.processProductData(data.product);
          this.sellerdetails = data.seller;
        this.startImage = this.product.images[0];
        
        },
        error: err => {
          console.log(err.message);
        }
    });
    
    // Bewertungen für das Produkt abrufen
    this.ratingService.getRatingsForProduct(this.productId).subscribe({
      next: data => {
        this.ratings = data.ratings;
        this.ratings.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.checkIfUserInRatings();       
      },
      error: err => {
        console.log(err.message);
      }
    });

    // Merkliste für den User abfragen
    this.watchlistService.getWatchlistForUser(this.currentUser.id).subscribe({
      next: data => {
        this.watchlist = data;
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Überprüfen ob der User bereits eine Bewertung abgegeben hat
  checkIfUserInRatings() {
    this.ratings.forEach((rating) => {
      if (rating.user.id === this.currentUser.id) {
        this.showRatingBtn = false;
      }
    })
  }  

  //Datum und Uhrzeit formattieren
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
  }

  // Produktbilder in ein Array umwandeln
  processProductData(product: any): any {
    const imagesArray: string[] = product.images
      .split(',')
      .map((imageUrl: string) => imageUrl.trim());
    return { ...product, images: imagesArray };
  }

  // Startbild ermitteln und anzeigen
  selectImage(image: string) {
    this.startImage = image;
  }

  // Mengen für Inputfeld generieren
  getQuantityOptions(maxQuantity: number): number[] {
    return Array.from({ length: maxQuantity +1 }, (_, index) => index );
  }

  // Zum Warenkorb hinzufügen
  addToCard() {
    if (this.selectedQuantity != 0 && this.selectedQuantity != null) {

      this.cardService
        .addToCard(this.selectedQuantity, this.currentUser.id, this.productId)
        .subscribe({
        next: (response: Object) => {
          this.isAddedToCart = true;
          this.showSuccessMessageWatchlist = false;
          this.showSuccessMessage = true;

          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000); 
          this.selectedQuantity = 0;
          this.ngOnInit();
          this.appComponent.ngOnInit();
          
        },
        error: (error: any) => {
          console.error('Fehler beim Hinzufügen in den Warenkorb', error);
        }
      });
    }
  }

  // Ratings anzeigen / verstecken
  toggleAddRating() {
    if (this.showAddRating) {
      if (this.isUserRatingValid()) {
        this.showAddRatingError = false;
        this.userRating.userid = this.currentUser.id;
        this.userRating.productid = this.productId;
        this.ratingService.addRating(this.userRating).subscribe({
          next: data => {
            console.log(data);
            this.showAddRating = false;
            this.ngOnInit();
          },
        error: err => {
          console.log(err.message);
        }
      });     
      }
      else {
        this.showAddRatingError = true;
      }
    }
    else {
      this.showAddRating = true;
      this.showAddRatingError = false;
    }
  }

  // Validieren der Inputfelder der Bewertung
  isUserRatingValid(): boolean {
    return !!this.userRating.header && !!this.userRating.text && !!this.userRating.rating;
  }

  // Zu den Bewertungen scrollen
  goToRatings() {
    this.viewportScroller.scrollToAnchor('ratings');
  }

  // Überprüfen ob das Produkt in der Merkliste ist
  isInWatchlist(product: any): boolean {
    return this.watchlist.some(item => item.product.id === product.id);
  }

  // Zur Merkliste hinzufügen
  addToWatchlist(product:any) {
    this.watchlistService.addProductToWatchlist(this.currentUser.id, product.id).subscribe({
      next: data => {
        this.showSuccessMessage = false;
        this.showSuccessMessageWatchlist = true;

            setTimeout(() => {
              this.showSuccessMessageWatchlist = false;
            }, 3000);
        this.ngOnInit();
        this.appComponent.ngOnInit();
      },
      error: err => {
        console.log(err.message);
      }
    });
  }
}
