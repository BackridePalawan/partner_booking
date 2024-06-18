import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-reports',
  templateUrl: './customer-reports.component.html',
  styleUrl: './customer-reports.component.scss',
})
export class CustomerReportsComponent implements OnInit {
  reports: any;
  constructor(private api: ApiServices, public datePipe: DatePipe) {}
  ngOnInit(): void {
    this.getCustomerReports();
  }
  title = 'Customer Reports';

  getCustomerReports() {
    this.api.getCustomerReports().subscribe({
      next: (res: any) => {
        this.reports = res.data;
        console.log(res);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: error.error.message,
          icon: 'error',
          timer: 3000,
        });
      },
    });
  }
}
