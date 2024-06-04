import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { error } from 'node:console';
import { Subscription, switchMap, timer } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isMonthlyFee = localStorage.getItem('role') === 'sub-affiliate-partner';
  isPopupOpen: boolean = false;
  visible2: boolean = false;
  cancelClick: number = 0;
  pollingSubscription: Subscription;
  pollingSubscription2: Subscription;
  monthAndFeepolling: Subscription;
  chartPollingSubscription: Subscription;
  getMonthEarnPollingSubscription: Subscription;
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
  onsearch: boolean = false;
  nextPage: string = '';
  prevPage: string = '';
  totalItem: string = '';
  currentPage = '1';
  payoutAccount: any;
  totalItems: any = [];
  displayedItems: any[] = [];
  startDate: any;
  startDateforEarnings: any;
  endDate: any;
  startDateForChart: any;
  endDateForChart: any;
  enroute_count: any = 0;
  cancelled_count: any = 0;
  todays_earnings: any = 0;
  chartdata: any[] = [];
  earningsFrom: string = '';
  reason: string = '';
  bookingIDtoCancel = 0;
  thisMonthEarn = 0;
  thisMonthFee = 0;
  thisSubAffiliateEarnFee = 0;
  thisMonthAdminFee = 0;
  searchValue = '';

  selectedDetails: any;
  currentMonth: any;

  private earningsSubject = new BehaviorSubject<number>(0);
  private chartDataSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  todays_earnings$ = this.earningsSubject.asObservable();
  chartdata$ = this.chartDataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private apiService: ApiServices,
    private router: ActivatedRoute,
    private route: Router,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const currentdate = new Date();

    const chartStartDate = new Date(
      new Date().setDate(currentdate.getDate() - 3)
    );
    const StartDate = new Date(new Date().setDate(currentdate.getDate() - 1));
    const chartEndDate = new Date(
      new Date().setDate(currentdate.getDate() + 1)
    );

    this.currentMonth = currentdate.getMonth() + 1;
    this.router.params.subscribe((params) => {
      this.filtervalue = params['status'] ? params['status'] : 'all';
    });

    this.startDate = `${StartDate.getFullYear()}-${
      StartDate.getMonth() + 1
    }-${StartDate.getDate()}`;

    this.startDateforEarnings = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate()}`;

    this.endDate = `${currentdate.getFullYear()}-${
      currentdate.getMonth() + 1
    }-${currentdate.getDate()}`;

    //for chart
    this.startDateForChart = `${chartStartDate.getFullYear()}-${
      chartStartDate.getMonth() + 1
    }-${chartStartDate.getDate()}`;
    this.endDateForChart = `${chartEndDate.getFullYear()}-${
      chartEndDate.getMonth() + 1
    }-${chartEndDate.getDate()}`;

    console.log([this.startDateForChart, this.endDateForChart]);

    // this.getCurrentOrder(this.currentPage);
    this.startPolling();
    this.startPolling2();
    this.chartPolling();
    this.monthlyPolling();
    this.getMonthEarnPolling();
    console.log(this.isMonthlyFee);
  }

  openShare(selectedDetails: any) {
    console.log(selectedDetails);
    this.visible2 = true;
  }

  openPopup(selectedId: number) {
    this.bookingIDtoCancel = selectedId;
    this.isPopupOpen = true;
  }

  getCurrentOrder(page: string) {
    this.loadingpage = true;
    this.stopPolling();
    this.currentPage = page;
    this.startPolling();

    // if (typeof localStorage !== 'undefined') {
    //   var token: any = localStorage.getItem('token');
    //   this.apiService
    //     .getEarningsOrders(
    //       { startDate: this.startDate, endDate: this.endDate },
    //       page
    //     )
    //     .subscribe({
    //       next: (res: any) => {
    //         console.log(res);
    //         // console.log(res['total']);
    //         this.displayedItems = res['data']['data'];
    //         this.from = res['data']['from'] ?? '';
    //         this.to = res['data']['to'] ?? '';
    //         this.enroute_count = res['enroute_count'] ?? 0;
    //         this.cancelled_count = res['cancelled_count'] ?? 0;
    //         this.totalItem = res['data']['total'] ?? '';
    //         this.totalItems =
    //           res['data']['links'].length !== 0
    //             ? res['data']['links'].slice(1, -1)
    //             : [];
    //         console.log(this.displayedItems);
    //         this.nextPage =
    //           res['data']['next_page_url'] != null
    //             ? res['data']['next_page_url']
    //             : '';
    //         this.prevPage =
    //           res['data']['prev_page_url'] != null
    //             ? res['data']['prev_page_url']
    //             : '';
    //         this.loadingpage = false;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //         console.log(error.error.message);
    //         this.loadingpage = false;
    //       },
    //     });
    // }
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
    this.loadingpage = true;
    this.stopPolling();
    // console.log(this.nextPage.split('=')[1]);
    this.currentPage = this.nextPage.split('=')[1];

    this.startPolling();
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    this.loadingpage = true;
    this.stopPolling();
    // console.log(this.nextPage.split('=')[1]);
    this.currentPage = this.prevPage.split('=')[1];

    this.startPolling();
  }

  statusChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filtervalue = inputElement.value;
    this.route.navigate(['affiliate/customers/' + this.filtervalue]);
    this.getCurrentOrder(this.currentPage);
  }

  openChart(data: any) {
    console.log(
      'chart display',
      data.map((ele: { created_at: any }) =>
        this.datePipe.transform(ele.created_at, 'MMMM d, y')
      )
    );
    this.earningsFrom = `Earnings From ${this.datePipe.transform(
      data[0]['created_at'],
      'MMMM d, y'
    )} To ${this.datePipe.transform(
      data[data.length - 1]['created_at'],
      'MMMM d, y'
    )}`;
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
          )} To ${this.datePipe.transform(
            data[data.length - 1]['created_at'],
            'MMMM d, y'
          )}`,
          data: data.map((ele: { commission: any }) => ele.commission),
          fill: false,
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
          const fetchedEarnings = res['data']['data'][3]['commission'];

          // Update todays_earnings only after successfully fetching the data
          this.todays_earnings = fetchedEarnings;
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
        console.log(this.bookingIDtoCancel, this.reason);
        this.loadingpage = true;
        this.apiService
          .cancelBooking(this.bookingIDtoCancel.toString(), this.reason)
          .subscribe({
            next: (res: any) => {
              Swal.fire({
                title: res.message,
                icon: 'success',
                timer: 2000,
              });
              this.loadingpage = false;
              this.isPopupOpen = false;
            },
            error: (error: HttpErrorResponse) => {
              Swal.fire({
                title: error.error.message,
                icon: 'error',
                timer: 2000,
              });
              this.loadingpage = false;
            },
          });
      }
    });
  }

  sendDetails(details: any) {
    this.loadingpage = true;
    console.log(details);
    var phonenumber =
      details.taxi_order.passenger_contact_number.slice(0, 2) == '09'
        ? '+63' + details.taxi_order.passenger_contact_number.slice(1)
        : details.taxi_order.passenger_contact_number;
    this.apiService
      .sendBookingDetails({
        booking_link: `http://localhost:4200/affiliate/viewbooking/${details.id}-${details.code}`,
        phone: phonenumber,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.visible2 = false;
          this.loadingpage = false;
        },
        error: (error: HttpErrorResponse) => {
          this.visible2 = false;
          this.loadingpage = false;
          Swal.fire({
            title: `Booking details #${details.id} Shared`,
            icon: 'success',
            timer: 2000,
          });
          console.log(error.error.message);
        },
      });
  }

  startPolling(): void {
    // Use timer to emit values at a fixed interval
    this.pollingSubscription = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.apiService.getEarningsAndOrders(
            {
              startDate: this.startDate,
              endDate: this.endDate,
              search: this.searchValue,
            },
            this.currentPage
          )
        )
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

  startPolling2(): void {
    // Use timer to emit values at a fixed interval
    this.pollingSubscription2 = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.apiService.getEarningsWeekly(
            { startDate: this.startDateforEarnings, endDate: this.endDate },
            '1'
          )
        )
      )
      .subscribe({
        next: (res: any) => {
          console.log('todays earnings', res);
          this.todays_earnings = res['data'][0]['commission'];
          // console.log();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.loadingpage = false;
        },
      });
  }

  monthlyPolling(): void {
    // Use timer to emit values at a fixed interval
    this.monthAndFeepolling = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.apiService.getMonthEarnAndFee({ month: this.currentMonth })
        )
      )
      .subscribe({
        next: (res: any) => {
          console.log('earnInMOnth', res);
          this.thisMonthEarn = res['total_commission'];
          this.thisMonthFee = res['total_admin_commission'];
          // console.log();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.loadingpage = false;
        },
      });
  }

  chartPolling(): void {
    console.log('heres the date', [
      this.startDateForChart,
      this.endDateForChart,
    ]);

    this.loadingSubject.next(true);

    this.chartPollingSubscription = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.apiService.getEarnings(
            {
              startDate: this.startDateForChart,
              endDate: this.endDateForChart,
            },
            '1'
          )
        )
      )
      .subscribe({
        next: (res: any) => {
          console.log('heres the chart');
          console.log(res);

          const fetchedEarnings = res['data']['data'][3]['commission'];
          const fetchedChartData = res['data']['data'];

          this.earningsSubject.next(fetchedEarnings);
          this.chartDataSubject.next(fetchedChartData);
          this.openChart(fetchedChartData);

          this.loadingSubject.next(false);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.loadingSubject.next(false);
        },
      });
  }

  stopChartPolling(): void {
    if (this.chartPollingSubscription) {
      this.chartPollingSubscription.unsubscribe();
    }
  }

  stopPolling(): void {
    // Unsubscribe from the polling subscription to stop further requests
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
  stopPolling2(): void {
    // Unsubscribe from the polling subscription to stop further requests
    if (this.pollingSubscription2) {
      this.pollingSubscription2.unsubscribe();
    }
  }
  stopMonthPolling(): void {
    // Unsubscribe from the polling subscription to stop further requests
    if (this.getMonthEarnPollingSubscription) {
      this.getMonthEarnPollingSubscription.unsubscribe();
    }
  }
  monthAndFeeStopPolling2(): void {
    // Unsubscribe from the polling subscription to stop further requests
    if (this.monthAndFeepolling) {
      this.monthAndFeepolling.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    // Stop polling when the component is destroyed
    this.stopPolling();
    this.stopPolling2();
    this.stopChartPolling();
  }

  searchBookings(event: Event) {
    console.log('stop');
    this.stopPolling();
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    if (this.searchValue == '') {
      this.onsearch = false;
      return;
    }
    this.onsearch = true;
    console.log('go');
    this.startPolling();
    console.log(this.searchValue);
  }

  getThisMonthEarningsFromSubAffiliate() {
    this.apiService.getEarningsFromSubAffiliate().subscribe({
      next: (res: any) => {
        console.log('sub affiliate earnings', res);
        this.thisSubAffiliateEarnFee = res.total_affiliate_commission;
        this.thisMonthAdminFee = res.total_admin_commission;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.message);
      },
    });
  }

  getMonthEarnPolling(): void {
    // Use timer to emit values at a fixed interval
    this.getMonthEarnPollingSubscription = timer(0, 5000)
      .pipe(switchMap(() => this.apiService.getEarningsFromSubAffiliate()))
      .subscribe({
        next: (res: any) => {
          console.log('sub affiliate earnings', res);
          this.thisSubAffiliateEarnFee = res.total_affiliate_commission;
          this.thisMonthAdminFee = res.total_admin_commission;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error.message);
        },
      });
  }
}
