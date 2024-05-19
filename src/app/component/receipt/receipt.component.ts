import { Component, Input, OnInit } from '@angular/core';
import { ApiServices } from '../../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss',
})
export class ReceiptComponent implements OnInit {
  @Input() orderReceipt: any;
  @Input() commissionNumber: number;
  totalNumber: number;
  paymentTotal: any;
  constructor(private apiService: ApiServices) {}

  ngOnInit(): void {
    console.log(this.orderReceipt);
    this.commissionNumber = Number(this.commissionNumber);
    this.totalNumber = Number(this.orderReceipt.total);

    this.paymentTotal = (this.commissionNumber + this.totalNumber).toFixed(2);
  }

  cancelBook(orderID: string, reason: string) {
    this.apiService.cancelBooking(orderID, reason).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Cancelled!!',
          icon: 'success',
        });
        location.reload();
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: 'Error',
          text: `${error.error.message}`,
          icon: 'error',
        });
      },
    });
  }

  async showCancelAlert() {
    const { value: reason } = await Swal.fire({
      title: 'Let us know the reason for your cancellation?',
      input: 'text',
      inputPlaceholder: 'Reason',
    });
    if (reason) {
      this.cancelBook(this.orderReceipt.id, reason);
    }
  }

  bookAnotherOne() {
    location.reload();
  }
}
