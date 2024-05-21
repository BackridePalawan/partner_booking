import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isPopupOpen: boolean = false;
  cancelClick: number = 0;

  cantBeCancel = ['enroute', 'failed', 'cancelled', 'delivered'];
  title: string = 'Dashboard';
  userDetail: any;
  data: any;
  options: any;
  // constructor() {}
  // ngOnInit(): void {
  //   this.userDetail = JSON.parse(localStorage.getItem('userDetails') ?? '');
  // }
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
  startDate: any;
  endDate: any;
  startDateForChart: any;
  endDateForChart: any;
  enroute_count: any = 0;
  cancelled_count: any = 0;
  todays_earnings: any = 0;
  chartdata: any[] = [];
  earningsFrom: string = '';
  reason: string = '';

  constructor(
    private apiService: ApiServices,
    private router: ActivatedRoute,
    private route: Router,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const currentdate = new Date();
    this.router.params.subscribe((params) => {
      this.filtervalue = params['status'] ? params['status'] : 'all';
    });
    this.startDate = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate() - 1}`;
    this.startDateForChart = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate() - 3}`;
    this.endDate = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate() + 1}`;
    this.endDateForChart = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate() + 1}`;

    console.log([this.startDate, this.endDate]);

    this.getCurrentOrder(this.currentPage);

    this.getChartDaily();
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  getCurrentOrder(page: string) {
    this.loadingpage = true;
    if (typeof localStorage !== 'undefined') {
      var token: any = localStorage.getItem('token');
      this.apiService
        .getEarningsOrders(
          { startDate: this.startDate, endDate: this.endDate },
          page
        )
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // console.log(res['total']);
            this.displayedItems = res['data']['data'];
            this.from = res['data']['from'] ?? '';
            this.to = res['data']['to'] ?? '';
            this.enroute_count = res['enroute_count'] ?? 0;
            this.cancelled_count = res['cancelled_count'] ?? 0;
            this.totalItem = res['data']['total'] ?? '';
            this.totalItems =
              res['data']['links'].length !== 0
                ? res['data']['links'].slice(1, -1)
                : [];
            console.log(this.displayedItems);
            this.nextPage =
              res['data']['next_page_url'] != null
                ? res['data']['next_page_url']
                : '';
            this.prevPage =
              res['data']['prev_page_url'] != null
                ? res['data']['prev_page_url']
                : '';
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
    this.getCurrentOrder(page);
    // console.log(this.currentPage);
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getCurrentOrder(this.nextPage.split('=')[1]);
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getCurrentOrder(this.prevPage.split('=')[1]);
  }

  statusChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filtervalue = inputElement.value;
    this.route.navigate(['affiliate/customers/' + this.filtervalue]);
    this.getCurrentOrder(this.currentPage);
  }

  openChart(data: any) {
    this.earningsFrom = `Earnings From ${this.datePipe.transform(
      data[0]['created_at'],
      'MMMM d, y'
    )} To ${this.datePipe.transform(data[4]['created_at'], 'MMMM d, y')}`;
    console.log(data);
    const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    // const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: data.map((ele: { created_at: any }) =>
        this.datePipe.transform(ele.created_at, 'MMMM d, y')
      ),
      datasets: [
        {
          label: `Earnings From ${this.datePipe.transform(
            data[0]['created_at'],
            'MMMM d, y'
          )} To ${this.datePipe.transform(data[4]['created_at'], 'MMMM d, y')}`,
          data: data.map((ele: { commission: any }) => ele.commission),
          fill: true,
          tension: 0.4,
          borderColor: '#7cae41',
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            // color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            // color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            // color: surfaceBorder,
          },
        },
      },
      onClick: (_: any, elements: any) => {},
    };
  }

  getTodaysEarnings() {
    this.apiService
      .getEarningsWeekly(
        { startDate: this.startDate, endDate: this.endDate },
        '1'
      )
      .subscribe({
        next: (res: any) => {
          this.todays_earnings = res['data'][0]['commission'];
          // console.log(res);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.loadingpage = false;
        },
      });
  }

  getChartDaily() {
    this.apiService
      .getEarnings(
        { startDate: this.startDateForChart, endDate: this.endDateForChart },
        '1'
      )
      .subscribe({
        next: (res: any) => {
          console.log('heres the chart');
          console.log(res);
          this.todays_earnings = res['data']['data'][3]['commission'];
          this.chartdata = res['data']['data'];
          this.openChart(this.chartdata);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.loadingpage = false;
        },
      });
  }

  pickReason(clickNumber: number, reason: string) {
    this.cancelClick = clickNumber;
    this.reason = reason;
  }

  closeModal() {
    this.isPopupOpen = false;
    this.cancelClick = 0;
    this.reason = '';
  }

  cancel() {
    if (this.cancelClick == 0) {
      Swal.fire({
        title: 'Please Select A Reason',
        icon: 'info',
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Back',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.apiService.cancelBooking({})
      }
    });
  }
}
