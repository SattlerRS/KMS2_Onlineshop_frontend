import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ProductService } from '../../_services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  user: any;
  products: any[] = []; 
  filteredproducts: any[] = [];
  p: any;
  filterText = '';
  itemsPerPage: number = 8;

  constructor(
    private tokenStorageService: TokenStorageService,
    private productService: ProductService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // User aus Sessionstorage abfragen
    this.user = this.tokenStorageService.getUser();

    // Produkte die ungeprüft sind aus der Datenbank abfragen
    this.productService.getProductsForAdminBoards(0).subscribe({
      next: data => {
        this.products = this.processProductsData(data);
        this.filteredproducts = this.products;
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

  // Produktliste nach dem Filterstring filtern
  applyFilter() {
    if (this.filterText.trim() !== '') {
      this.filteredproducts = this.products.filter(product => {
        return product.productname.toLowerCase().includes(this.filterText.toLowerCase());
      });
    } else {
      this.filteredproducts = this.products;
    }
  }

  // Einzelnes Produkt freigeben
  releaseProduct(product: any) {
    this.productService.releaseProduct(product.id).subscribe({
      next: data => {
        this.ngOnInit();
        this.showSuccessSnackbar(product.productname.slice(0, 30) +' wurde freigegeben');
      },
        error: err => {
          console.log(err.message);
      }
    });
  }

  // Alle Produkte freigeben
  releaseAll() {
    this.productService.releaseAllProducts(this.products).subscribe({
      next: data => {
        this.ngOnInit();
        this.showSuccessSnackbar('Alle Produkte wurden freigegeben');
      },
        error: err => {
          console.log(err.message);
      }
    });
  }

  // Bildschirmmeldung ausgeben
  showSuccessSnackbar(message: string) {
    this.snackBar.open(message, 'Schließen', {
      duration: 3000,
      panelClass: ['snackbar-custom'],
      horizontalPosition: 'center',
      verticalPosition:'top'
    });
  }
}
