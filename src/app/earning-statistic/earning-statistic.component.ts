import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-earning-statistic',
  templateUrl: './earning-statistic.component.html',
  styleUrl: './earning-statistic.component.scss',
})
export class EarningStatisticComponent implements OnInit {
  title: string = 'Earning Statistics';
  filtervalue: string = 'delivered';
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
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
  weekDays: Date[];

  constructor(private apiService: ApiServices, public datePipe: DatePipe) {}
  ngOnInit(): void {
    this.selectedDate = new Date();
    console.log(this.selectedDate); // Initialize with current date
    this.calculateWeeklyRange();
    this.getEarnings(this.currentPage);
  }

  calculateWeeklyRange(): void {
    const selected = new Date(this.selectedDate);
    const dayOfWeek = selected.getDay();
    const diff = selected.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday if Sunday

    this.startDate = new Date(selected.setDate(diff));
    this.endDate = new Date(selected.setDate(diff + 6));

    this.weekDays = this.getWeekDays(this.startDate);

    console.log([this.startDate, this.endDate]);
    console.log(this.weekDays);
  }

  getDateRange(event: Event) {
    console.log(event);
  }

  getWeekDays(startDate: Date): Date[] {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  }

  getEarnings(page: string) {
    this.loadingpage = true;
    if (typeof localStorage !== 'undefined') {
      var token: any = localStorage.getItem('token');
      this.apiService
        .getEarnings({ startDate: this.startDate, endDate: this.endDate }, page)
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
    this.getEarnings(page);
    // console.log(this.currentPage);
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getEarnings(this.nextPage.split('=')[1]);
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getEarnings(this.prevPage.split('=')[1]);
  }
}
