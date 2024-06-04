import { Component } from '@angular/core';
import { ApiServices } from '../../services/api-services';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-weekly-statistic',
  templateUrl: './weekly-statistic.component.html',
  styleUrl: './weekly-statistic.component.scss',
})
export class WeeklyStatisticComponent {
  months: any = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  };

  years: number[] = [];

  total: number = 0;
  // chart
  data: any;

  options: any;
  // end chart
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
  selectedDate: string;
  selectedMonth: string;
  selectedYear: string;
  weeks: any;
  currentDate: string;

  constructor(private apiService: ApiServices, public datePipe: DatePipe) {
    //
    //
  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    this.selectedYear = currentYear.toString();
    this.selectedMonth = currentMonth.toString();
    console.log('your month is = ' + currentMonth.toString());
    console.log('your year is = ' + currentYear.toString());
    const startYear = currentYear - 10; // Adjust the range as needed
    const endYear = currentYear + 10;
    for (let year = startYear - 10; year <= endYear; year++) {
      this.years.push(year);
    }
    // Get the current date
    // Initialize with current date
    this.weeks = this.getWeeksInMonth(
      parseFloat(this.selectedYear),
      parseFloat(this.selectedMonth)
    );

    // console.log('this is the ' + this.weeks);
    // this.getEarningsOrders(this.currentPage);
    this.getEarnings(this.currentPage);
    // console.log([this.startDate, this.endDate]);
  }

  monthChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.selectedMonth = inputElement.value;
    this.weeks = this.getWeeksInMonth(
      parseFloat(this.selectedYear),
      parseFloat(this.selectedMonth)
    );
    this.getEarningsOrders(this.currentPage);
    this.getEarnings(this.currentPage);

    console.log(this.weeks);
  }

  yearChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.selectedYear = inputElement.value;
    this.weeks = this.getWeeksInMonth(
      parseFloat(this.selectedYear),
      parseFloat(this.selectedMonth)
    );
    this.getEarningsOrders(this.currentPage);
    this.getEarnings(this.currentPage);
  }

  getEarningsOrders(page: string) {
    this.loadingpage = true;
    if (typeof localStorage !== 'undefined') {
      var token: any = localStorage.getItem('token');
      this.apiService
        .getEarningsOrders(
          {
            startDate: this.weeks[0].start,
            endDate: this.weeks[this.weeks.length - 1].end,
          },
          page
        )
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
    this.getEarningsOrders(page);
    console.log(this.currentPage);
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getEarningsOrders(this.nextPage.split('=')[1]);
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getEarningsOrders(this.prevPage.split('=')[1]);
  }

  getWeeksInMonth(
    year: number,
    month: number
  ): { start: string; end: string; days: string[] }[] {
    const weeks: { start: string; end: string; days: string[] }[] = [];
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    let currentWeekStart = new Date(firstDayOfMonth);
    let currentWeekEnd = new Date(firstDayOfMonth);
    let currentWeekDays: string[] = [];

    while (currentWeekStart <= lastDayOfMonth) {
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
      if (currentWeekEnd > lastDayOfMonth) {
        currentWeekEnd = new Date(lastDayOfMonth);
      }

      for (
        let d = new Date(currentWeekStart);
        d <= currentWeekEnd;
        d.setDate(d.getDate() + 1)
      ) {
        currentWeekDays.push(
          `${d.getFullYear()}/${this.formatNumber(
            d.getDate()
          )}/${this.formatNumber(d.getMonth() + 1)}`
        );
      }

      weeks.push({
        start: `${currentWeekStart.getFullYear()}/${this.formatNumber(
          currentWeekStart.getMonth() + 1
        )}/${this.formatNumber(currentWeekStart.getDate())}`,
        end: `${currentWeekEnd.getFullYear()}/${this.formatNumber(
          currentWeekEnd.getMonth() + 1
        )}/${this.formatNumber(currentWeekEnd.getDate())}`,
        days: [...currentWeekDays],
      });

      currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
      currentWeekDays = [];
    }
    console.log(weeks);
    return weeks;
  }

  formatNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  getEarnings(page: string) {
    console.log('length', this.weeks.length - 1);
    this.loadingpage = true;
    if (typeof localStorage !== 'undefined') {
      var token: any = localStorage.getItem('token');
      this.apiService
        .getEarningsWeekly(
          {
            startDate: this.weeks[0].start,
            endDate: this.weeks[this.weeks.length - 1].end,
          },
          page
        )
        .subscribe({
          next: (res: any) => {
            console.log('responseweekly', res);
            // console.log(res['total']);
            this.displayedItems = res['data'];
            // this.from = res['from'] ?? '';
            // this.to = res['to'] ?? '';
            // this.totalItem = res['total'] ?? '';
            // this.totalItems =
            //   res['links'].length !== 0 ? res['links'].slice(1, -1) : [];
            // console.log(this.displayedItems);
            // this.nextPage =
            //   res['next_page_url'] != null ? res['next_page_url'] : '';
            // this.prevPage =
            //   res['prev_page_url'] != null ? res['prev_page_url'] : '';
            this.total = this.displayedItems
              .reduce((sum, order) => sum + order.commission, 0)
              .toFixed(2);

            console.log(this.total);

            this.loadingpage = false;
            this.openChart(res['data']);
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error.message);
            this.loadingpage = false;
          },
        });
    }
  }

  openChart(data: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    // const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: data.map(
        (ele: { week_start: any; week_end: any }) =>
          `${this.datePipe.transform(
            ele.week_start,
            'MMMM d, y'
          )} to ${this.datePipe.transform(ele.week_end, 'MMMM d, y')}`
      ),
      datasets: [
        {
          label: `Earnings From`,
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
      onClick: (_: any, elements: any) => {
        if (elements.length) {
          // The user clicked on a label
          console.log(data[elements[0].index]);
        }
      },
    };
  }
}
