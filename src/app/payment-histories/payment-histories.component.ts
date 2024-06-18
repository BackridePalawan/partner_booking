import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-histories',
  templateUrl: './payment-histories.component.html',
  styleUrl: './payment-histories.component.scss',
})
export class PaymentHistoriesComponent implements OnInit {
  constructor(private api: ApiServices, public datePipe: DatePipe) {}
  paymentData: any[] = [];
  currentEarnings: any = '';
  isAffiliate: boolean = true;
  ngOnInit(): void {
    this.getPaymentHistory();
  }

  getPaymentHistory() {
    this.api.getPaymentHistory().subscribe({
      next: (res: any) => {
        this.paymentData = res.subAffiliatePayment.data;
        this.currentEarnings =
          res.currentEarnings.weeklyPayment ?? res.currentEarnings.payment;
        console.log('current earnings', this.currentEarnings);
        this.isAffiliate = res.isAffiliate;
        console.log(res);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
}
