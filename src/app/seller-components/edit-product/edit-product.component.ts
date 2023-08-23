import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: any;
  currentUser: any;
  selectedFiles: File[] = [];

  constructor(
    private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {

    // Produkt aus dem History.State abfragen
    this.product = history.state.product;

      // Wenn ein Produkt gefunden wurde, wird es in den LocalStorage gespeichert
      if (this.product) {
        localStorage.setItem('product', JSON.stringify(this.product)); 
      }
      
      // Wenn keines gefunden wurde wird es aus dem LocalStorage abgerufen
      if (!this.product) {
        const storedProduct = localStorage.getItem('product');
        
        // Wenn eines abgerufen wurde wird es in ein Json Objekt geparset
        if (storedProduct) {
          this.product = JSON.parse(storedProduct);
        }

        // Danach werden die Produktbilder in ein File Array als Placeholder geladen
        for (const image of this.product.images) {
          this.selectedFiles.push(new File([], 'Placeholder'));
        }
      }
  }
  
  // Änderungen werden überpüft und gespeichert, der Datenbankeintrag für das Produkt wird überschrieben
  onSubmit() {
     if (this.product.images.length > 0) {
      this.productService.changeProduct(this.product, this.selectedFiles).subscribe({
        next: (response: Object) => {
          console.log('Produkt erfolgreich hinzugefügt', response);
          this.router.navigate(['/sel']);
        },
        error: (error: any) => {
          console.error('Fehler beim Hinzufügen des Produkts', error);
        }
      });
    }
  }

  // Produktbild aus den beiden Arrays löschen
  deleteImage(index: number) {
    this.product.images.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  // Produktbild hinzufügen
  addSelectedImage(event: any) {
    if (this.product.images.length < 4) {
      const fileInput = event.target;
      const fileList = fileInput.files;

      // Nur das erste ausgewählte Bild verarbeiten und anzeigen
      if (fileList.length > 0) {
        const file = fileList[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const imageSrc = e.target.result;
          this.product.images.push(imageSrc);
          this.selectedFiles.push(file);
        };
        reader.readAsDataURL(file);
      }
    }
  }
}

