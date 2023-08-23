import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TokenStorageService } from '../_services/token-storage.service';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.css']
})
export class CookieConsentComponent implements OnInit {
  showCookieConsent = false;
  user: any;

  constructor(
    private cookieService: CookieService,
    private token: TokenStorageService,
    private refreshService: RefreshService) { }

  ngOnInit(): void {
    this.refreshService.refresh$.subscribe(() => {
      this.user = this.token.getUser();
      if (this.user && this.user.accessToken) {
        this.checkCookieConsent();
      }
    });

    this.user = this.token.getUser();
    if (this.user && this.user.accessToken) {
      this.checkCookieConsent();
    }
  }

  // Überprüfen ob Cookie existiert
  checkCookieConsent(): void {
    const cookieName = `cookie_consent_${this.user.id}`;
    const cookieValue = this.cookieService.get(cookieName);
    this.showCookieConsent = cookieValue !== 'accepted';
  }

  // Cookie akzeptiert speichern
  acceptCookies(): void {
    const cookieName = `cookie_consent_${this.user.id}`;
    this.cookieService.set(cookieName, 'accepted', 365); 
    this.showCookieConsent = false;
  }


  rejectCookies(): void {
    const cookieName = `cookie_consent_${this.user.id}`;
    this.cookieService.set(cookieName, 'rejected', 365);
    this.showCookieConsent = false;
  }

  // zeigt das Cookiepanner nur an wenn der Cookie noch nicht akzeptiert oder abgelehnt wurde
  showCookieConsentIfRequired(): void {
    this.user = this.token.getUser();
    if (this.user && this.user.accessToken) {
      this.checkCookieConsent();
    }
  }
}
