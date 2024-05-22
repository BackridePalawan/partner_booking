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
import { WeeklyStatisticComponent } from './earning-statistic/weekly-statistic/weekly-statistic.component';
import { MonthlyStatisticComponent } from './earning-statistic/monthly-statistic/monthly-statistic.component';
import { YearlyStatisticComponent } from './earning-statistic/yearly-statistic/yearly-statistic.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AuthGuardServices } from './services/auth.services';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'affiliate',
    canActivate: [AuthGuardServices],

    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      { path: 'statistics', component: EarningStatisticComponent },
      { path: 'statistics/weekly', component: WeeklyStatisticComponent },
      { path: 'statistics/monthly', component: MonthlyStatisticComponent },
      { path: 'statistics/yearly', component: YearlyStatisticComponent },
      { path: 'book/customer', component: BookComponent },
      { path: 'book/details/:orderId', component: OrderDetailsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'customers/:status', component: BookedCustomerComponent },
      { path: 'customers', component: BookedCustomerComponent },
      { path: 'viewbooking/:code', component: ViewBookingComponent },
      { path: '', component: DashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
