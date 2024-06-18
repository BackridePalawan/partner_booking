import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServices } from '../../services/api-services';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sub-affiliate-details',
  templateUrl: './sub-affiliate-details.component.html',
  styleUrl: './sub-affiliate-details.component.scss',
})
export class SubAffiliateDetailsComponent {
  title = 'Sub - Affiliate';
  loading = true;
  subAffiliate_id = '';
  finished_bookings = 0;
  cancelled_bookings = 0;
  sub_affiliate_earnings = 0;
  details: any;

  filtervalue = 'all';
  searchValue = '';
  onsearch: boolean = false;

  totalPage = 0;
  page = 1;
  orders: any[] = [];

  constructor(private route: ActivatedRoute, private api: ApiServices) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params['sub-affiliate-id'] as string;
      this.subAffiliate_id = code;
    });
    console.log(this.subAffiliate_id);
    this.getDetails();
    // this.getDriverDetails();
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }

  getDetails() {
    this.api.getSubAffiliateDetail(this.subAffiliate_id).subscribe({
      next: (res: any) => {
        this.details = res.user;
        this.finished_bookings = res.finished_bookings;
        this.cancelled_bookings = res.cancelled_bookings;
        this.sub_affiliate_earnings = res.subAffeliateEarnings;
        this.loading = false;
        console.log(res);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  statusChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filtervalue = inputElement.value;
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }

  searchOrderEvent(event: Event) {
    this.onsearch = true;
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    console.log(inputElement.value);
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
    // this.searchOrder(this.filtervalue, this.searchValue, this.currentPage);
  }

  searchOrder(page: string, status: string, searcgValue: string) {
    this.loading = true;
    this.api
      .getSubAffiliateOrder(this.subAffiliate_id, status, searcgValue, page)
      .subscribe({
        next: (res: any) => {
          this.orders = res.data;
          this.totalPage = res.last_page;
          console.log(res);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  nextPage() {
    if (this.page == this.totalPage) {
      return;
    }
    this.page++;
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }

  prevPage() {
    if (this.page == 1) {
      return;
    }
    this.page--;
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }
}
