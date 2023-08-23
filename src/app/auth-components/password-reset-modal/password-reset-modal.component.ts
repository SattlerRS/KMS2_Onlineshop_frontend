import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../_services/auth.service';


@Component({
  selector: 'app-password-reset-modal',
  templateUrl: './password-reset-modal.component.html',
  styleUrls: ['./password-reset-modal.component.css']
})
export class PasswordResetModalComponent {
  email: string = '';
  showSuccess: boolean = false;
  showEmailNotFoundError: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private authService: AuthService) { }


  //Passwort zurücksetzen
  requestPasswordReset() {
    this.authService.resetPassword(this.email).subscribe({
      next: data => {
        if (data.emailfound === false) {
          this.showEmailNotFoundError = !data.emailfound;
        }
        else {
          this.showSuccess = true;
        }  
      },
      error: err => {
        console.log(err);
      }
    });
  }

  //Fehlermeldung Email nicht gefunden wieder ausblenden
  onEmailInputChange() {
    this.showEmailNotFoundError = false; 
  }

  // Modal schließen
  closeModal() {
    this.close.emit();
  }
}
