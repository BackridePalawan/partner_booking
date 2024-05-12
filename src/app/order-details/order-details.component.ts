import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  loadingPage: boolean = true;
  orderId: string;
  orderDetail: any;
  commissionNumber: number;
  totalNumber: number;
  paymentTotal: any;
  constructor(
    private router: ActivatedRoute,
    private ApiService: ApiServices
  ) {}
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.orderId = params['orderId'];
      this.orderDetails();
      console.log(this.orderId);
    });
  }

  orderDetails() {
    this.ApiService.getOrderDetails(this.orderId).subscribe({
      next: (res) => {
        this.orderDetail = res;
        console.log(this.orderDetail);
        this.commissionNumber = Number(
          this.orderDetail.affiliate_order.commission
        );
        this.totalNumber = Number(this.orderDetail.total);

        this.paymentTotal = (this.commissionNumber + this.totalNumber).toFixed(
          2
        );
        this.loadingPage = false;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
}
