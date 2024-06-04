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
import { isActiveServices } from './services/isActive.services';
import { DriversComponent } from './drivers/drivers.component';
import { DriverDetailsComponent } from './drivers/driver-details/driver-details.component';
import { SubAffiliateComponent } from './sub-affiliate/sub-affiliate.component';

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
      {
        path: 'statistics',
        component: EarningStatisticComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'statistics/weekly',
        component: WeeklyStatisticComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'statistics/monthly',
        component: MonthlyStatisticComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'statistics/yearly',
        component: YearlyStatisticComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'book/customer',
        component: BookComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'book/details/:orderId',
        component: OrderDetailsComponent,
        canActivate: [isActiveServices],
      },
      { path: 'notifications', component: NotificationsComponent },
      {
        path: 'customers/:status',
        component: BookedCustomerComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'customers',
        component: BookedCustomerComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'viewbooking/:code',
        component: ViewBookingComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'drivers',
        component: DriversComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'driver/details/:driverId',
        component: DriverDetailsComponent,
        canActivate: [isActiveServices],
      },
      {
        path: 'sub-affiliates',
        component: SubAffiliateComponent,
        canActivate: [isActiveServices],
      },
      { path: '', component: DashboardComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
