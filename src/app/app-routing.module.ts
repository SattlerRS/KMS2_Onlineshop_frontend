import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserGuard } from './guards/user.guard';
import { SellerGuard } from './guards/seller.guard';
import { AdminGuard } from './guards/admin.guard';
import { CheckoutGuard } from './guards/chekout.guard'
import { OrderGuard } from './guards/order.guard'
import { WatchlistGuard } from './guards/watchlist.guard'
import { ShowProductGuard } from './guards/show-product.guard'
import { EditProductGuard } from './guards/edit-product.guard'

import { Register_as_userComponent } from './auth-components/register_as_user/register_as_user.component';
import { RegisterAsSellerComponent } from './auth-components/register-as-seller/register-as-seller.component';
import { LoginComponent } from './auth-components/login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './user-components/board-user/board-user.component';
import { BoardSellerComponent } from './seller-components/board-seller/board-seller.component';
import { BoardAdminComponent } from './admin-components/board-admin/board-admin.component';
import { AddProductComponent } from './seller-components/add-product/add-product.component'
import { EditProductComponent } from './seller-components/edit-product/edit-product.component'
import { ShowProductComponent } from './user-components/show-product/show-product.component'
import { CardComponent } from './user-components/card/card.component'
import { CheckoutComponent } from './user-components/checkout/checkout.component'
import { OrdersComponent } from './user-components/orders/orders.component'
import { AgbComponent } from './legal_components/agb/agb.component'
import { DsgvoComponent } from './legal_components/dsgvo/dsgvo.component'
import { ImpressumComponent } from './legal_components/impressum/impressum.component'
import { WatchlistComponent } from './user-components/watchlist/watchlist.component'
import { SellerdashboardComponent } from './seller-components/sellerdashboard/sellerdashboard.component'
import { ShowSellerComponent } from './user-components/show-seller/show-seller.component'
import { NewsletterComponent } from './admin-components/newsletter/newsletter.component'
import { PasswordResetNewpasswordComponent } from './auth-components/password-reset-newpassword/password-reset-newpassword.component'
import { LockProductsComponent } from './admin-components/lock-products/lock-products.component';




const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register_as_userComponent },
  { path: 'register_as_seller', component: RegisterAsSellerComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent , canActivate: [UserGuard] },
  { path: 'sel', component: BoardSellerComponent, canActivate: [SellerGuard] },
  { path: 'sel_dash', component: SellerdashboardComponent, canActivate: [SellerGuard] },
  { path: 'addProduct', component: AddProductComponent , canActivate: [SellerGuard]},
  { path: 'editProduct/:productId', component: EditProductComponent , canActivate: [SellerGuard,EditProductGuard]},
  { path: 'showProduct/:productId', component: ShowProductComponent, canActivate: [UserGuard, ShowProductGuard]  },
  { path: 'card', component: CardComponent, canActivate: [UserGuard, CheckoutGuard]},
  { path: 'checkout', component: CheckoutComponent, canActivate: [UserGuard, CheckoutGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [UserGuard,OrderGuard] }, 
  { path: 'watchlist', component: WatchlistComponent, canActivate: [UserGuard, WatchlistGuard] }, 
  { path: 'showSeller/:sellerId', component: ShowSellerComponent, canActivate: [UserGuard] }, 

  { path: 'admin', component: BoardAdminComponent, canActivate: [AdminGuard] },
  { path: 'lockProducts', component: LockProductsComponent, canActivate: [AdminGuard] },
  { path: 'admin_newsletter', component: NewsletterComponent, canActivate: [AdminGuard] },

  { path: 'agb', component: AgbComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'dsgvo', component: DsgvoComponent },
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'reset-password/:token', component: PasswordResetNewpasswordComponent },
  { path: '**', redirectTo: '/home',}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
