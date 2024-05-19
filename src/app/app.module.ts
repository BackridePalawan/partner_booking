import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingComponentComponent } from './component/loading-component/loading-component.component';
import { PasswordModule } from 'primeng/password';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { BookComponent } from './book/book.component';
import { MapboxComponent } from './component/mapbox/mapbox.component';
import { DriverSearchComponent } from './component/driver-search/driver-search.component';
import { ReceiptComponent } from './component/receipt/receipt.component';
import { BookedCustomerComponent } from './booked-customer/booked-customer.component';
import { NavHeaderComponent } from './component/nav-header/nav-header.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DatePipe } from '@angular/common';
import { EarningStatisticComponent } from './earning-statistic/earning-statistic.component';
import { ChartModule } from 'primeng/chart';
import { WeeklyStatisticComponent } from './earning-statistic/weekly-statistic/weekly-statistic.component';
import { MonthlyStatisticComponent } from './earning-statistic/monthly-statistic/monthly-statistic.component';
import { YearlyStatisticComponent } from './earning-statistic/yearly-statistic/yearly-statistic.component';
import { ConnectingToDriverComponent } from './component/connecting-to-driver/connecting-to-driver.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    LoadingComponentComponent,
    DashboardComponent,
    SidebarComponent,
    BookComponent,
    MapboxComponent,
    DriverSearchComponent,
    ReceiptComponent,
    BookedCustomerComponent,
    NavHeaderComponent,
    OrderDetailsComponent,
    EarningStatisticComponent,
    WeeklyStatisticComponent,
    MonthlyStatisticComponent,
    YearlyStatisticComponent,
    ConnectingToDriverComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputOtpModule,
    ProgressSpinnerModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [provideClientHydration(), DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
