import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { ProfileService } from '../_services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  sellerData: any;
  userData: any;
  currentUser: any;
  isEditing: boolean = false;
  imgFile: any;
  selectedImageSeller: any;
  selectedImageUser: any;

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordMismatch: boolean = false;
  passwordchangesuccess: boolean = false;
  errortextPasword: string = '';
  successtext: string = '';


  constructor(
    private token: TokenStorageService,
    private profilservice: ProfileService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {

    // Wenn nicht eingeloggt auf Home Seite umleiten
    if (!this.token.getToken()) {
      this.router.navigate(['/home']);
    }

    this.currentUser = this.token.getUser();
    // Verküferdaten abfragen wenn SELLER
    if (this.currentUser.roles[0] == 'SELLER') {
      this.profilservice.getProfileFromSeller(this.currentUser.id).subscribe({
        next: data => {
          this.sellerData = data.seller;
          this.selectedImageSeller = this.sellerData.image;
          
        },
        error: err => {
          console.log(err.message);
        } 
      });
    }
    
    // Userdaten abfragen wenn USER
    else if (this.currentUser.roles[0] == 'USER') {
      this.profilservice.getProfileFromUser(this.currentUser.id).subscribe({
        next: data => {
          this.userData = data;
          this.userData.userid = this.userData.id;
          this.userData.birthdate = this.birthdayformatter(this.userData.birthdate);
          this.selectedImageUser = this.userData.image;      
        },
        error: err => {
          console.log(err.message);
        } 
      });
    }
  }

  // Formattiert das Geburtsdatum auf die gewünschte Form
   birthdayformatter(birthdateOld:any) {
    const birthdate = new Date(birthdateOld);
    const year = birthdate.getFullYear();
    let month = (birthdate.getMonth() + 1).toString().padStart(2, '0');
    let day = birthdate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Userdaten updaten
  submitForm() {

    // Prüfen ob eingeloggter User die Rolle SELLER besitzt, dann Sellerprofildaten updaten
    if (this.currentUser.roles[0] == 'SELLER') {
      this.profilservice.updateSellerData(this.sellerData, this.imgFile).subscribe({
        next: (response: Object) => {
          console.log(response);
          location.reload();
        },
        error: (error: any) => {
          console.error('Fehler beim Updaten der Profildaten', error);
        }
      });
    }

    // Prüfen ob eingeloggter User die Rolle USER besitzt, dann Userprofildaten updaten
    else if (this.currentUser.roles[0] == 'USER') {
      this.profilservice.updateUserDataWithImage(this.userData, this.imgFile).subscribe({
        next: (response: Object) => {
          console.log(response);
          location.reload();
        },
        error: (error: any) => {
          console.error('Fehler beim Updaten der Profildaten', error);
        }
      });
    }
  }

  // Bearbeitungsmodus umschalten
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // Profilbild Handler
  onImageSelected(event: any) {
    this.imgFile = event.target.files[0];

    if (this.imgFile) {
      const reader = new FileReader();

      if (this.currentUser.roles[0] == 'SELLER') {
        reader.onload = (e: any) => {
          this.selectedImageSeller = e.target.result;
        };
      }
      else if (this.currentUser.roles[0] == 'USER') {
        reader.onload = (e: any) => {
          this.selectedImageUser = e.target.result;
        };
      }
      reader.readAsDataURL(this.imgFile);
    }
  }

  // Passwort ändern Logik
  changePassword() {
    if (this.currentPassword.length < 1) {
      this.passwordchangesuccess = false;
      this.passwordMismatch = true;
      this.errortextPasword = 'Das aktuelle Passwort darf nicht leer sein!'      
    }
    else if (this.newPassword.length < 8 || this.newPassword != this.confirmNewPassword) {
      if (this.newPassword.length < 8 || this.confirmNewPassword.length < 8) {
        this.passwordchangesuccess = false;
        this.passwordMismatch = true;
        this.errortextPasword = 'Das Passwort muss min. 8 Zeichen lang sein!'
      }
      else if (this.newPassword != this.confirmNewPassword) {
        this.passwordchangesuccess = false;
        this.passwordMismatch = true;
        this.errortextPasword = 'Die Passwörter stimmen nicht überein!'
      }

    } else {
      this.passwordMismatch = false;
      this.authService.changePassword(this.currentPassword, this.newPassword,this.confirmNewPassword, this.currentUser.id).subscribe({
        next: data => {
          this.successtext = data.message;
          this.passwordchangesuccess = true;
          this.passwordMismatch = false;
          this.deletePasswordFields();

        },
        error: err => {
          this.passwordMismatch = true;
          this.passwordchangesuccess = false;
          this.errortextPasword = err.error.message;
          this.deletePasswordFields();
        }
      });
    }
  }

  // Passwort ändern Modal zurücksetzen
  resetPasswordChangeForm() {
    this.deletePasswordFields();
    this.passwordchangesuccess = false;
    this.passwordMismatch = false;
  }

  // Passwortfelder leeren
  deletePasswordFields() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }
}
