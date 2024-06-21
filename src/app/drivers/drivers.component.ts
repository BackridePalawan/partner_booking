import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'node:console';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss',
})
export class DriversComponent {
  title = 'Drivers';
  sendlinktoDriver = false;
  filtervalue: string = '';
  loadingpage: boolean = true;
  loading: boolean = true;
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

  form: FormGroup = this.formBuilder.group({
    phone: ['', Validators.required],
    recipient: ['', [Validators.required]],
    driver: true,
  });

  ngOnInit(): void {
    // this.router.params.subscribe((params) => {
    //   this.filtervalue = params['status'] ? params['status'] : 'all';
    // });
    this.searchDriver(this.searchValue, this.currentPage);
    // this.getBookings(this.currentPage, this.filtervalue);
  }

  constructor(
    private apiService: ApiServices,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private route: Router,
    public datePipe: DatePipe
  ) {}

  onPageChange(startIndex: string, page: string) {
    console.log(startIndex);
    this.currentPage = page;
    this.searchDriver(this.searchValue, this.currentPage);
    // console.log(this.currentPage);
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    // this.getBookings(, this.filtervalue);
    this.searchDriver(this.searchValue, this.nextPage.split('=')[1]);
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    // this.getBookings(this.prevPage.split('=')[1], this.filtervalue);
    this.searchDriver(this.searchValue, this.prevPage.split('=')[1]);
  }

  searchDriverEvent(event: Event) {
    this.onsearch = true;
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    console.log(inputElement.value);
    this.searchDriver(this.searchValue, this.currentPage);
  }

  searchDriver(search: string, page: string) {
    this.loadingpage = true;
    this.apiService.getDrivers(search, page).subscribe({
      next: (res: any) => {
        console.log('driver', res);
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
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.message);
        this.loadingpage = false;
      },
    });
  }

  deactivateDriver(driverId: string) {
    Swal.fire({
      title: 'Are you sure you want to deactivate this account?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      this.loading = true;
      if (result.isConfirmed) {
        console.log(driverId);
        this.apiService.deactivateDriver(driverId).subscribe({
          next: (res: any) => {
            Swal.fire({
              timer: 5000,
              title: 'Deactivated',
              icon: 'success',
            });
            this.searchDriver(this.searchValue, this.currentPage);
            this.loading = false;
          },
          error: (error: HttpErrorResponse) => {
            Swal.fire({
              timer: 5000,
              text: error.error.message,
              icon: 'error',
            });
            this.loading = false;
          },
        });
      }
      this.loading = false;
    });
  }

  activateDriver(driverId: string) {
    Swal.fire({
      title: 'Are you sure you want to Activate this account?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      this.loading = true;
      if (result.isConfirmed) {
        console.log(driverId);
        this.apiService.activateDriver(driverId).subscribe({
          next: (res: any) => {
            Swal.fire({
              timer: 5000,
              title: 'Activated',
              icon: 'success',
            });
            this.searchDriver(this.searchValue, this.currentPage);
            this.loading = false;
          },
          error: (error: HttpErrorResponse) => {
            Swal.fire({
              timer: 5000,
              text: error.error.message,
              icon: 'error',
            });
            this.loading = false;
          },
        });
      }
      this.loading = false;
    });
  }

  sendLink() {
    console.log(this.form.value);
    this.loading = true;
    this.apiService.sendDriverLink(this.form.value).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Sent',
          icon: 'success',
          timer: 2000,
        });
        this.sendlinktoDriver = false;
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: error.error.message,
          icon: 'error',
          timer: 2000,
        });
        this.sendlinktoDriver = false;
      },
    });
  }
}
