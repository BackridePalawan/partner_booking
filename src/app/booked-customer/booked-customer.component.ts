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
  title: string = 'Transactions';
  filtervalue: string = '';
  loadingpage: boolean = true;
  inputData: any = [];
  from: string = '';
  rental_name: string = '';
  to: string = '';
  onsearch: boolean = false;
  nextPage: string = '';
  prevPage: string = '';
  totalItem: string = '';
  currentPage = '1';
  payoutAccount: any;
  totalItems: any = [];
  displayedItems: any[] = [];
  searchValue: string = '';

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.filtervalue = params['status'] ? params['status'] : 'all';
    });
    this.searchOrder(this.filtervalue, this.searchValue, this.currentPage);
    // this.getBookings(this.currentPage, this.filtervalue);
  }

  constructor(
    private apiService: ApiServices,
    private router: ActivatedRoute,
    private route: Router,
    public datePipe: DatePipe
  ) {}

  getBookings(page: string, status: string) {
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
    this.currentPage = page;
    this.searchOrder(this.filtervalue, this.searchValue, this.currentPage);
    // console.log(this.currentPage);
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    // this.getBookings(, this.filtervalue);
    this.searchOrder(
      this.filtervalue,
      this.searchValue,
      this.nextPage.split('=')[1]
    );
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    // this.getBookings(this.prevPage.split('=')[1], this.filtervalue);
    this.searchOrder(
      this.filtervalue,
      this.searchValue,
      this.prevPage.split('=')[1]
    );
  }

  statusChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filtervalue = inputElement.value;
    this.route.navigate(['affiliate/customers/' + this.filtervalue]);
    this.searchOrder(this.filtervalue, this.searchValue, this.currentPage);
  }

  searchOrderEvent(event: Event) {
    this.onsearch = true;
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    console.log(inputElement.value);
    this.searchOrder(this.filtervalue, this.searchValue, this.currentPage);
  }

  searchOrder(status: string, search: string, page: string) {
    this.loadingpage = true;
    this.apiService
      .searchBookingOrder(page, {
        searchvalue: search,
        status: status,
      })
      .subscribe({
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
          this.onsearch = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.loadingpage = false;
        },
      });
  }
}
