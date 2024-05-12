import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booked-customer',
  templateUrl: './booked-customer.component.html',
  styleUrl: './booked-customer.component.scss',
})
export class BookedCustomerComponent implements OnInit {
  title: string = 'Booked Customers';
  filtervalue: string = '';
  loadingpage: boolean = true;
  inputData: any = [];
  from: string = '';
  rental_name: string = '';
  to: string = '';
  onsearch: boolean = true;
  nextPage: string = '';
  prevPage: string = '';
  totalItem: string = '';
  currentPage = '1';
  payoutAccount: any;
  totalItems: any = [];
  displayedItems: any[] = [];

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.filtervalue = params['status'] ? params['status'] : 'all';
    });

    this.getApproveRental(this.currentPage, this.filtervalue);
  }

  constructor(
    private apiService: ApiServices,
    private router: ActivatedRoute,
    private route: Router,
    public datePipe: DatePipe
  ) {}

  getApproveRental(page: string, status: string) {
    this.loadingpage = true;
    if (typeof localStorage !== 'undefined') {
      var token: any = localStorage.getItem('token');
      this.apiService.getAffiliateOrders(page, status).subscribe({
        next: (res: any) => {
          console.log(res);
          // console.log(res['total']);
          this.displayedItems = res['data'];
          this.from = res['from'] ?? '';
          this.to = res['to'] ?? '';
          this.totalItem = res['total'] ?? '';
          this.totalItems =
            res['links'].length !== 0 ? res['links'].slice(1, -1) : [];
          console.log(this.displayedItems);
          this.nextPage =
            res['next_page_url'] != null ? res['next_page_url'] : '';
          this.prevPage =
            res['prev_page_url'] != null ? res['prev_page_url'] : '';
          this.loadingpage = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.loadingpage = false;
        },
      });
    }
  }

  onPageChange(startIndex: string, page: string) {
    console.log(startIndex);
    this.getApproveRental(page, this.filtervalue);
    // console.log(this.currentPage);
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getApproveRental(this.nextPage.split('=')[1], this.filtervalue);
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getApproveRental(this.prevPage.split('=')[1], this.filtervalue);
  }

  statusChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filtervalue = inputElement.value;
    this.route.navigate(['affiliate/customers/' + this.filtervalue]);
    this.getApproveRental(this.currentPage, this.filtervalue);
  }
}
