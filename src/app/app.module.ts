import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth-components/login/login.component';
import { Register_as_userComponent } from './auth-components/register_as_user/register_as_user.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './admin-components/board-admin/board-admin.component';
import { BoardSellerComponent } from './seller-components/board-seller/board-seller.component';
import { BoardUserComponent } from './user-components/board-user/board-user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { RegisterAsSellerComponent } from './auth-components/register-as-seller/register-as-seller.component';
import { AddProductComponent } from './seller-components/add-product/add-product.component';
import { EditProductComponent } from './seller-components/edit-product/edit-product.component';
import { ShowProductComponent } from './user-components/show-product/show-product.component';
import { CardComponent } from './user-components/card/card.component';

import { CheckoutComponent } from './user-components/checkout/checkout.component';
import { OrdersComponent } from './user-components/orders/orders.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { AgbComponent } from './legal_components/agb/agb.component';
import { ImpressumComponent } from './legal_components/impressum/impressum.component';
import { DsgvoComponent } from './legal_components/dsgvo/dsgvo.component';
import { WatchlistComponent } from './user-components/watchlist/watchlist.component';
import { SellerdashboardComponent } from './seller-components/sellerdashboard/sellerdashboard.component';
import { CookieService } from 'ngx-cookie-service';
import { CookieConsentComponent } from './cookies/cookie.component';
import { ShowSellerComponent } from './user-components/show-seller/show-seller.component';
import { NewsletterComponent } from './admin-components/newsletter/newsletter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordResetModalComponent } from './auth-components/password-reset-modal/password-reset-modal.component';
import { PasswordResetNewpasswordComponent } from './auth-components/password-reset-newpassword/password-reset-newpassword.component';
import { LockProductsComponent } from './admin-components/lock-products/lock-products.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Register_as_userComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardSellerComponent,
    BoardUserComponent,
    RegisterAsSellerComponent,
    AddProductComponent,
    EditProductComponent,
    ShowProductComponent,
    CardComponent,
    CheckoutComponent,
    OrdersComponent,
    AgbComponent,
    ImpressumComponent,
    DsgvoComponent,
    WatchlistComponent,
    SellerdashboardComponent,
    CookieConsentComponent,
    ShowSellerComponent,
    NewsletterComponent,
    PasswordResetModalComponent,
    PasswordResetNewpasswordComponent,
    LockProductsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [authInterceptorProviders,CookieService,CookieConsentComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
