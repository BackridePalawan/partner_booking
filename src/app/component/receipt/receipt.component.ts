import { Component, Input, OnInit } from '@angular/core';

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

  ngOnInit(): void {
    console.log(this.orderReceipt);
    this.commissionNumber = Number(this.commissionNumber);
    this.totalNumber = Number(this.orderReceipt.total);

    this.paymentTotal = (this.commissionNumber + this.totalNumber).toFixed(2);
  }
}
