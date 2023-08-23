import { Component, HostListener  } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { WatchlistService } from './_services/watchlist.service';
import { CardService } from './_services/card.service';
import { OrdersService } from './_services/orders.service';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from './_services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showSellerBoard = false;
  showUserBoard = false;
  username?: string;
  user: any;
  card: any;
  cardlength: number = 0;
  orders: any[] = [];
  watchlist: any[] = []
  showScrollToTop = false;
  isDarkMode: boolean = true;

  cookieAccepted: boolean = false;
  profilImage: string = 'http://localhost:8080/profilImgs/profil.png';

  // GoToTop Button anzeigen wenn Seite eine Scrollbar hat
  @HostListener('window:scroll', [])
    onWindowScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      this.showScrollToTop = scrollY > 0;
    }
  
  constructor(
    private tokenStorageService: TokenStorageService,
    private cardService: CardService,
    private ordersService: OrdersService,
    private watchlistService: WatchlistService,
    private cookieService: CookieService,
    private profileService: ProfileService) { }
  
  
  // Zum Seitenanfang scrollen
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      
      // User aus dem Session Storage abfragen
      this.user = this.tokenStorageService.getUser();

      // Überprüfen ob die Cookies abkzeptiert wurden
      this.proofIfCookieIsAccepted();
      this.username = this.user.username;
      this.roles = this.user.roles;

      // Überprüfen welche Komponenten angezeigt werden sollen
      this.showUserBoard = this.roles.includes('USER');
      this.showAdminBoard = this.roles.includes('ADMIN');
      this.showSellerBoard = this.roles.includes('SELLER');
      if (this.showUserBoard) {
        this.loadcardFromDB();
        this.loadOrdersFromDB();
        this.loadWatchlistFromDB();

        // Profilbild für den User abfragen und anzeigen
        this.profileService.getProfileFromUser(this.user.id).subscribe({
          next: data => {
            if (data.image) {
              this.profilImage = data.image; 
            }
          }
        }); 
      }

      // Profilbild für den Verkäufer abfragen und anzeigen
      else if (this.showSellerBoard) {
        this.profileService.getProfileFromSeller(this.user.id).subscribe({
          next: data => {
            if (data.seller.image) {
              this.profilImage = data.seller.image; 
            }     
          }
        });       
      }
    }
  }

  // Prüft ob die Cookies angenommen wurden
  proofIfCookieIsAccepted() {
    const cookieName = `cookie_consent_${this.user.id}`;
    const cookieValue = this.cookieService.get(cookieName);
    this.cookieAccepted = cookieValue === 'accepted';

    // Wenn Cookies akzeptiert sind wird der Dark/Lightmode abgefragt
    if (this.cookieAccepted) {
      const modeCookie = `cookie_mode_${this.user.id}`;
      const modeValue = this.cookieService.get(modeCookie);
      if (modeValue == 'lightmode') {
        this.isDarkMode = false;
      }
    }
  }

  // Merkliste des Users vom Backend abrufen
  loadWatchlistFromDB() {
    this.watchlistService.getWatchlistForUser(this.user.id).subscribe({
      next: data => {
        this.watchlist = data;
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Warenkorb des Users vom Backend abrufen
  loadcardFromDB() {
    if (this.showUserBoard) {
      this.cardService.getCardFromUser(this.user.id).subscribe({
        next: data => {
          this.card = data;
          this.cardlength= this.card.length;
        },
        error: err => {
          console.log(err.message);
        }
      });
    }
  }

  // Bestellungen des Users vom Backend abrufen
  loadOrdersFromDB() {
    this.ordersService.getOrdersFromUser(this.user.id).subscribe({
      next: data => {
        this.orders = data.orders;
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Ausloggen
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  // Dark/Lightmode in den Cookies des Users speichern
  toggleMode() {
    if(this.cookieAccepted){
      const modeCookie = `cookie_mode_${this.user.id}`;
      if(!this.isDarkMode){
        this.cookieService.set(modeCookie, 'lightmode', 365);
      }
      else if(this.isDarkMode) {
        this.cookieService.set(modeCookie, 'darkmode', 365);
      }
    }
  }
}
