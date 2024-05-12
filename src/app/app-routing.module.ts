import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookComponent } from './book/book.component';
import { BookedCustomerComponent } from './booked-customer/booked-customer.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { EarningStatisticComponent } from './earning-statistic/earning-statistic.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'affiliate',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'statistics', component: EarningStatisticComponent },
      { path: 'book/customer', component: BookComponent },
      { path: 'book/details/:orderId', component: OrderDetailsComponent },
      { path: 'customers/:status', component: BookedCustomerComponent },
      { path: 'customers', component: BookedCustomerComponent },
      { path: '', component: DashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
