import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-password-reset-newpassword',
  templateUrl: './password-reset-newpassword.component.html',
  styleUrls: ['./password-reset-newpassword.component.css']
})
export class PasswordResetNewpasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  passwordResetSuccess: boolean = false;
  passwordResetError: boolean = false;
  showTokenError: boolean = false;
  remainingTime: number = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.timerForForwardingToHome("home");  
      }

      // Überprüfe, ob der Token noch gültig ist
      this.authService.checkResetTokenValidity(this.token!).subscribe({
        next: data => {
          // Der Token ist gültig
        },
        error: err => {
          this.showTokenError = true;
          this.passwordResetSuccess = true;
          this.timerForForwardingToHome("home"); 
        }
      });
    });
  }

  // Timer für die Umleitung auf die Home oder Login Seite
  timerForForwardingToHome(site: string) {
    let remainingSeconds = 5;
    const countdownInterval = setInterval(() => {
    remainingSeconds--;
    this.remainingTime = remainingSeconds;

    if (remainingSeconds === 0) {
      clearInterval(countdownInterval);
      // Navigiere zur Home-Seite
      this.router.navigate(['/'+site]);
      }
    }, 1000); 
  }

  // Passwort zurücksetzen
  resetPassword() {
    if (this.newPassword === this.confirmPassword && this.newPassword.length >= 8) {
      this.authService.resetPasswordWithToken(this.token!, this.newPassword).subscribe({
        next: data => {
          console.log(data);
          this.passwordResetSuccess = true;
          this.timerForForwardingToHome("login");
        },
        error: err => {
          console.log(err);
          this.passwordResetError = true;
        }
      });
    } 
  }
}







