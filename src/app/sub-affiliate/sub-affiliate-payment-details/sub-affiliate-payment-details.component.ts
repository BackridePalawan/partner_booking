import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ApiServices } from '../../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sub-affiliate-payment-details',
  templateUrl: './sub-affiliate-payment-details.component.html',
  styleUrl: './sub-affiliate-payment-details.component.scss',
})
export class SubAffiliatePaymentDetailsComponent {
  constructor(
    private api: ApiServices,
    public datePipe: DatePipe,
    private route: ActivatedRoute
  ) {}
  paymentData: any[] = [];
  currentEarnings: any = '';
  userdetails: any;
  isAffiliate: boolean = true;
  loading: boolean = true;
  page = 1;
  user_id: string;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params['sub-affiliate-id'] as string;
      this.user_id = code;
    });
    this.getPaymentHistory();
  }

  getPaymentHistory() {
    this.api
      .getSubAffiliatePayment(this.user_id, this.page.toString())
      .subscribe({
        next: (res: any) => {
          this.paymentData = res.subAffiliatePayment.data;
          this.userdetails = res.user;
          this.currentEarnings =
            res.currentEarnings.weeklyPayment ?? res.currentEarnings.payment;
          console.log('current earnings', this.currentEarnings);
          this.isAffiliate = res.isAffiliate;
          console.log(res);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }
}
