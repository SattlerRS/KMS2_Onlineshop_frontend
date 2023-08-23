import { Component, OnInit  } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { WatchlistService } from '../../_services/watchlist.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AppComponent } from '../../app.component';
import { CardService } from '../../_services/card.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  products: any[] = [];
  user: any;
  watchlist: any[] = []
  filteredproducts: any[] = [];

  filterText: string = ''; 
  showZeroAmountProducts: boolean = false;
  showCardBanner: boolean = false;
  productCardBanner: string = '';
  showWatchlistBanner: boolean = false;
  productWatchlistBanner: string = '';
  p: number = 0;

  showRatingFilter: boolean = false;
  showCategoryFilter: boolean = false;
  showSellerFilter: boolean = false;
  showPriceFilter: boolean = false;
  isFiltered: boolean = false;

  priceFrom: number = 0;
  priceTo: number = 0;
  productSellers: any[] = [];
  productCategories: any[] = [];
  selectedCategories: string[] = [];
  selectedSellers: string[] = [];
  selectedStar: number | null = null;
  filterInfoText: string = '';

  itemsPerPage: number = 8;

  constructor(
    private productService: ProductService,
    private router: Router,
    private watchlistService: WatchlistService,
    private tokenStorageService: TokenStorageService,
    private appComponent: AppComponent,
    private cardService: CardService,
  ) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();

    // Merkliste für User einlesen
    this.watchlistService.getWatchlistForUser(this.user.id).subscribe({
      next: data => {
        this.watchlist = data;
      },
      error: err => {
        console.log(err.message);
      }
    });

    // Freigegebene Produkte abrufen
    this.productService.getProducts().subscribe({
      next: data => {
        
        // Speichern der Produktbilder im Array
        this.products = this.processProductsData(data.products); 

        // Produkte löschen die einen Lagerstand von 0 haben
        this.products = this.products.filter(product => product.productamount > 0);
        this.filteredproducts = this.products;
        
        // Produktkategorien auslesen
        const allCategories = this.filteredproducts.map(product => product.productcategorie);
        this.productCategories = allCategories.filter((category, index) => allCategories.indexOf(category) === index);

        // Verkäufer auslesen
        const allSellers = this.filteredproducts.map(product => product.sellerdetails.shopname);
        this.productSellers = allSellers.filter((seller, index) => allSellers.indexOf(seller) === index);

        // Wenn Filter aktiv --> Filter methode ausführen
        if (this.isFiltered) {
          this.filterProducts();
        }
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

  // Filter hinzufügen
  applyFilter() {
    if (this.filterText.trim() !== '') {
      this.filteredproducts = this.products.filter(product => {
        return product.productname.toLowerCase().includes(this.filterText.toLowerCase());
      });
    } else {
      this.filteredproducts = this.products;
    }
  }

  // Zur Seite ShowProduct wechseln und die Id in der Url mitgeben
  showProduct(product: any) {
    const productId = product.id;
    this.router.navigate(['showProduct', productId])
  }

  // Produkt zur Merkliste hinzufügen
  addToWatchlist(product: any) {
    this.watchlistService.addProductToWatchlist(this.user.id, product.id).subscribe({
      next: data => {
        this.ngOnInit();
        this.appComponent.ngOnInit();
        this.showCardBanner = false;
        this.productWatchlistBanner = product.productname;
        this.showWatchlistBanner = true; // Zeige das Banner an
        setTimeout(() => {
          this.showWatchlistBanner = false; // Verstecke das Banner nach einigen Sekunden (optional)
        }, 5000);
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Überprüfen ob das Produkt bereits in der Merkliste ist
  isInWatchlist(product: any): boolean {
    return this.watchlist.some(item => item.product.id === product.id);
  }

  // Produkt zum Warenkorb hinzufügen
  addProductToCard(item: any) {
    this.cardService.addToCard(1, this.user.id, item.id).subscribe({
      next: data => {
        this.ngOnInit();
        this.appComponent.ngOnInit();
        this.showWatchlistBanner = false;
        this.productCardBanner = item.productname;
        this.showCardBanner = true; // Zeige das Banner an
        setTimeout(() => {
          this.showCardBanner = false; // Verstecke das Banner nach einigen Sekunden
        }, 5000);

      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Filter Bewertungen anzeigen/verstecken
  toogleRatingFilter() {
    this.showRatingFilter = !this.showRatingFilter;
  }

  // Filter Kategorie anzeigen/verstecken
  toogleCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter;
  }

  // Filter Verkäufer anzeigen/verstecken
  toogleSellerFilter() {
    this.showSellerFilter = !this.showSellerFilter;
  }

  // Filter Preis anzeigen/verstecken
  tooglePriceFilter() {
    this.showPriceFilter = !this.showPriceFilter;
  }

  // Sternebwewertung Sterne Handling
  onStarClicked(star: number) {
    if (this.selectedStar === star) {
      this.selectedStar = null;
    } else {
      this.selectedStar = star;
    }
  }

  // Steuert die CSS Klassen für die ausgewählt Optik
  getStarIconClass(star: number) {
    return this.selectedStar !== null && star <= this.selectedStar ? "bi bi-star-fill orange fs-4 " : "bi bi-star orange fs-4";
  }

  //Ausgewählte Kategorien Arrayhandler
  onCategoryCheckboxChange(event: any) {
    const category = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      const index = this.selectedCategories.indexOf(category);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  //Ausgewählte Verkäufer Arrayhandler
  onSellerCheckboxChange(event: any) {
    const category = event.target.value;
    if (event.target.checked) {
      // Add the category to the selectedCategories array if checked
      this.selectedSellers.push(category);
      console.log(this.selectedSellers)
    } else {
      // Remove the category from the selectedCategories array if unchecked
      const index = this.selectedSellers.indexOf(category);
      if (index !== -1) {
        this.selectedSellers.splice(index, 1);
        console.log(this.selectedSellers)
      }
    }
  }
  // Optionen für Preis Filter erstellen
  generatePriceOptions(start: number, max: number, step: number): number[] {
    const options: number[] = [];
    for (let price = start; price <= max; price += step) {
      options.push(price);
    }
    return options;
  }

  // Filter für die Produkte ausführen
  filterProducts() {

    this.filteredproducts = this.products;
    this.filterInfoText = '';
    this.p = 1;

    // Filter für Bewertung
    if (this.showRatingFilter) {
      this.filteredproducts = this.filteredproducts.filter((product) => {
        return this.selectedStar === null || product.rating === this.selectedStar;
      })
      this.isFiltered = true;
      this.filterInfoText += 'Bewertung: ' + this.selectedStar + ", ";
    }
    //Filter für Produktkategorie
    if (this.showCategoryFilter) {
      this.filteredproducts = this.filteredproducts.filter((product) => {
        return this.selectedCategories.length === 0 || this.selectedCategories.includes(product.productcategorie);
      });
      this.isFiltered = true;
      this.filterInfoText += 'Kategorie: ';
      this.selectedCategories.forEach((category) => {
        this.filterInfoText += category + ", ";
      });     
    }

    //Filter für Verkäufer
    if (this.showSellerFilter) {
      this.filteredproducts = this.filteredproducts.filter((product) => {
        return this.selectedSellers.length === 0 || this.selectedSellers.includes(product.sellerdetails.shopname);
      });
      this.isFiltered = true;
      this.filterInfoText += 'Verkäufer: ';
      this.selectedSellers.forEach((seller) => {
        this.filterInfoText += seller + ", ";
      });  
    }

    //Filter für Preis
    if (this.showPriceFilter) {
      this.filteredproducts = this.filteredproducts.filter((product) => {
        return product.productprice >= this.priceFrom && product.productprice <= this.priceTo;
      });
      this.isFiltered = true;
      this.filterInfoText += 'Preis: von ' + this.priceFrom + ' € bis ' + this.priceTo + " €" ;
    }
  }

  //Filter löschen
  delFilter() {
    this.filteredproducts = this.products;
    this.isFiltered = false;
    this.showRatingFilter = false;
    this.showCategoryFilter = false;
    this.showSellerFilter = false;
    this.showPriceFilter = false;
    this.selectedCategories = [];
    this.selectedSellers = [];
    this.selectedStar = null;
    this.priceFrom = 0;
    this.priceTo = 0;
  }
}

