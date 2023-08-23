import { Component } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent{
  user = JSON.parse(sessionStorage.getItem('auth-user') ?? '');
  
  form: any = {
    userid: this.user.id,
    productname: null,
    productdescription: null,
    productcategorie: null,
    productid: null,
    productprice: null,
    productamount: null
  };
  selectedImages: string[] = [];
  selectedFiles: File[] = [];
  

  constructor(private productService: ProductService, private router: Router) { }

  // Produktbild hinzufügen
  addSelectedImage(event: any) {
    if (this.selectedImages.length < 4) {
      const fileInput = event.target;
      const fileList = fileInput.files;

      // Nur das erste ausgewählte Bild verarbeiten und anzeigen
      if (fileList.length > 0) {
        const file = fileList[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const imageSrc = e.target.result;
          this.selectedImages.push(imageSrc);
          this.selectedFiles.push(file);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // Produktbild löschen
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }
  
  // Produkt in die Datenbank speichern und zur Produktübersicht wechseln
  onSubmit() {
    if (this.selectedFiles.length > 0) {
      this.productService.addProduct(this.form, this.selectedFiles).subscribe({
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
}
