import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-as-seller',
  templateUrl: './register-as-seller.component.html',
  styleUrls: ['./register-as-seller.component.css']
})
export class RegisterAsSellerComponent implements OnInit {

  emailForm: any = {
    email: null,
  }

  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  roles: string[] = [];
  emailVerified: boolean = false;
  verificationCode: string = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private appComponent: AppComponent,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isSuccessful = true;
      this.roles = this.tokenStorage.getUser().roles;
      console.log(this.roles);
    }
  }

  // Email überprüfen ob sie existiert und einen Verifikationscode per Mail versenden
  emailVerification() {
    this.authService.emailVerification(this.emailForm.email).subscribe({
      next: data => {
        this.emailVerified = true;
        this.form.email = this.emailForm.email;
        this.showSuccessSnackbar('Verifizierungscode wurde an Ihre Email versendet!');
        this.verificationCode = data.verificationCode;
      },
      error: err => {
        this.showSuccessSnackbar('Sie haben keine gültige Email angegeben!');
      }
    });
    
  }

  // Regsitrieren als Verkäufer
  onSubmit(): void {
    const { username, email, password } = this.form;

    if (this.isVerificationCodeValid()) {
      this.authService.register_as_seller(username, email, password).subscribe({
        next: data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.appComponent.ngOnInit();
          this.router.navigate(['/home']);
              
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      });
    }
  }

  // Seite neu laden
  reloadPage(): void {
    window.location.reload();
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

  // Verifikation Code überprüfen
  isVerificationCodeValid() {
    return this.form.verificationCode == this.verificationCode;
  }

  // Form Zurücksetzen
  resetForm() {
    this.emailVerified = false;
    this.emailForm.email = '';
    this.form.username = null;
    this.form.email = null;
    this.form.password = null;
  };
}

