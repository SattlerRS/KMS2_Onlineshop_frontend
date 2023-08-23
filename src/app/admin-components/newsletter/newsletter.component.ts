import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { NewsletterService } from '../../_services/newsletter.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  products: any[] = [];
  selectedCheckboxes: { [productId: number]: boolean } = {};
  p: any;
  newsletterbanner: boolean = false;

  constructor(
    private productService: ProductService,
    private newsletterService: NewsletterService) { }

  ngOnInit(): void {

    // Alle Produkte aus der Datenbank abrufen
    this.productService.getProducts().subscribe({
      next: data => {
        this.products = this.processProductsData(data.products);
        this.products.sort((a, b) => b.sold - a.sold);
        this.initializeCheckboxes();
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Produktbilder in eine Array umwandeln
  processProductsData(products: any[]): any[] {
    return products.map((product: any) => {
      const imagesArray: string[] = product.images.split(',').map((imageUrl: string) => imageUrl.trim());
      return { ...product, images: imagesArray };
    });
  }

  // Checkboxen initialisieren
  initializeCheckboxes() {
    for (let index = 0; index < 5; index++) {
      this.selectedCheckboxes[this.products[index].id] = true;
    }
  }

  // Checkbox Wert zwischenspeichern
  toggleCheckbox(productID: number) {
    this.selectedCheckboxes[productID] = !this.selectedCheckboxes[productID];
  }

  // Die ausgewählten Produkte als Newsletter verschicken
  handleNewsletter() {
    const selectedProducts = this.products.filter(product => this.selectedCheckboxes[product.id]);
    this.newsletterService.sendNewsletter(selectedProducts).subscribe({
      next: data => {

        // Zeige das Banner an
        this.newsletterbanner = true; 

        // Verstecke das Banner nach einigen Sekunden (optional)
        setTimeout(() => {
          this.newsletterbanner = false; 
        }, 5000);
      },
      error: err => {
        console.log(err.message);
      }
    });
  }
}
