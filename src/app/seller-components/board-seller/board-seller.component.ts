import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-seller.component.html',
  styleUrls: ['./board-seller.component.css']
})
export class BoardSellerComponent implements OnInit {
  products: any[] = [];
  filteredproducts: any[] = [];
  user = JSON.parse(sessionStorage.getItem('auth-user') ?? '');
  p: any;
  filterText = ''; 
  showAmountBtn: any;
  showZeroAmountProducts = false;
  itemsPerPage: number = 8;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    
    // Produkte für den eingeloggten Verkäufer abrufen
    this.productService.getProductsForSeller(this.user.id).subscribe({
      next: data => {
        this.products = this.processProductsData(data.products);
        this.filteredproducts = this.products;
        console.log(this.filteredproducts);
        this.showAmountBtn = false;
        for (const product of this.products) {
          if (product.productamount === 0) {
            this.showAmountBtn = true; 
            break;
          }
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

  // Zur Seite edit-product wechseln, die ProduktID wird über die Url mitgegeben
  editProduct(product: any) { 
     const productId = product.id;
    this.router.navigate(['editProduct', productId], { state: { product: product } });
  }

  // Produkt löschen, wird aus der Datenbank gelöscht und die Seite wird neu geladen
  deleteProduct(product: any) {
      this.productService.deleteProduct(product.id, product.images).subscribe({
        next: (response: Object) => {
          console.log('Produkt erfolgreich gelöscht', response);
          location.reload();
        },
        error: (error: any) => {
          console.error('Fehler beim Löschen des Produkts', error);
        }
      });
    }  

  // Produkte nach Filtertext filtern
  applyFilter() {
    if (this.filterText.trim() !== '') {
      this.filteredproducts = this.products.filter(product => {
        return product.productname.toLowerCase().includes(this.filterText.toLowerCase());
      });
    } else {
      this.filteredproducts = this.products;
    }
  }

  // Prokute nach Produktmenge 0 Filtern
  filterProductsByAmount() {
    if (this.showZeroAmountProducts) {
      this.filteredproducts = this.products.filter(product => product.productamount === 0);
    } else {
      this.filteredproducts = this.products;
    }
  }

  // ToggleButton für Produktmeneg 0 Filter
  toggleShowZeroAmountProducts() {
    this.showZeroAmountProducts = !this.showZeroAmountProducts;
    this.p = 1;
    this.filterProductsByAmount();
  }
}
