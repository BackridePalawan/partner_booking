import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServices } from '../services/api-services';
import { Router } from '@angular/router';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-affiliate',
  templateUrl: './sub-affiliate.component.html',
  styleUrl: './sub-affiliate.component.scss',
})
export class SubAffiliateComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServices,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.searchSubAfffiliate(this.searchValue, this.currentPage);
  }
  loadingpage: boolean = false;
  title = 'Sub Affiliates';
  selectedDay = 'Monday';
  deFaultDay = 'Monday';
  isModal = false;
  openWeeklyPayment = false;
  imageUrl = 'assets/images/camera.jpg';

  filtervalue: string = '';

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

  submitted = false;

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    affiliate_fee: ['', [Validators.required]],
    earning_percentage: ['', [Validators.required]],
    profile: ['', Validators.required],
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form!.patchValue({
        profile: file,
      });
      this.form!.get('profile')!.updateValueAndValidity();

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openWeeklyPaymentModal() {
    this.openWeeklyPayment = true;
  }

  closeWeeklyPaymentModal() {
    this.selectedDay = this.deFaultDay;
    this.openWeeklyPayment = false;
  }

  selectDay(day: string) {
    this.selectedDay = day;
  }

  addAffiliate() {
    this.isModal = true;
  }

  submitSubAffiliate() {
    this.isModal = false;
    this.loadingpage = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    var phonenumber =
      this.form.get('phone')?.value.slice(0, 2) == '09'
        ? '+63' + this.form.get('phone')?.value.slice(1)
        : this.form.get('phone')?.value;

    this.form.patchValue({
      phone: phonenumber,
    });

    const submitData = new FormData();

    submitData.append('name', this.form.get('name')?.value);
    submitData.append('email', this.form.get('email')?.value);
    submitData.append('phone', this.form.get('phone')?.value);
    submitData.append('password', this.form.get('password')?.value);
    submitData.append('affiliate_fee', this.form.get('affiliate_fee')?.value);
    submitData.append(
      'earning_percentage',
      this.form.get('earning_percentage')?.value
    );
    const profile = this.form?.get('profile')?.value;
    if (profile) {
      submitData.append('profile', profile);
    }
    this.apiService.addSubAffiliate(submitData).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: res.message,
          icon: 'success',
          timer: 2000,
        });
        this.loadingpage = false;
        this.form.patchValue({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          affiliate_fee: '',
          earning_percentage: '',
          profile: '',
        });
        this.searchSubAfffiliate(this.searchValue, this.currentPage);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: error.error.message,
          icon: 'error',
          timer: 2000,
        });
        this.loadingpage = false;
        this.isModal = true;
      },
    });
  }

  closeModal() {
    this.form.patchValue({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      affiliate_fee: '',
      earning_percentage: '',
      profile: '',
    });
    this.isModal = false;
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    // this.getBookings(, this.filtervalue);
    this.searchSubAfffiliate(this.searchValue, this.nextPage.split('=')[1]);
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    // this.getBookings(this.prevPage.split('=')[1], this.filtervalue);
    this.searchSubAfffiliate(this.searchValue, this.prevPage.split('=')[1]);
  }

  searchSubAfffiliateEvent(event: Event) {
    this.onsearch = true;
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    console.log(inputElement.value);
    this.searchSubAfffiliate(this.searchValue, this.currentPage);
  }

  searchSubAfffiliate(search: string, page: string) {
    this.loadingpage = true;
    this.apiService.getSubAffiliate(search, page).subscribe({
      next: (res: any) => {
        console.log('sub_affiliate', res);
        this.selectedDay = res['paymentSchedule'];
        this.deFaultDay = res['paymentSchedule'];
        // console.log(res['total']);
        this.displayedItems = res['details']['data'];
        this.from = res['details']['from'] ?? '';
        this.to = res['details']['to'] ?? '';
        this.totalItem = res['details']['total'] ?? '';
        this.totalItems =
          res['details']['links'].length !== 0
            ? res['details']['links'].slice(1, -1)
            : [];
        console.log('displayed', this.displayedItems);
        this.nextPage =
          res['details']['next_page_url'] != null
            ? res['details']['next_page_url']
            : '';
        this.prevPage =
          res['details']['prev_page_url'] != null
            ? res['details']['prev_page_url']
            : '';
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

  onPageChange(startIndex: string, page: string) {
    console.log(startIndex);
    this.currentPage = page;
    this.searchSubAfffiliate(this.searchValue, this.currentPage);
    // console.log(this.currentPage);
  }

  setSubAffiliatePayment() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change the payment schedule ${this.deFaultDay} to ${this.selectedDay}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.apiService
          .setSubAffiliateFee({ paymentSet: this.selectedDay })
          .subscribe({
            next: (res: any) => {
              this.selectedDay = res.day;
              this.deFaultDay = res.day;
              this.loading = false;
              Swal.fire({
                title: `Payment Schedule set to ${this.selectedDay}`,
                icon: 'success',
                timer: 2000,
              });
            },
            error: (error: HttpErrorResponse) => {
              Swal.fire({
                title: error.error.message,
                icon: 'error',
                timer: 2000,
              });
              this.loading = false;
            },
          });
      }
    });
  }

  setSubAffiliatePaid(user_id: string, payment_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.apiService
          .setSubAffiliatePaid({ user_id: user_id, payment_id: payment_id })
          .subscribe({
            next: (res: any) => {
              Swal.fire({
                title: `Payment for ID #${user_id} has been successfully completed.`,
                icon: 'success',
                timer: 3000,
              });
              this.searchSubAfffiliate(this.searchValue, this.currentPage);
            },
            error: (error: HttpErrorResponse) => {
              console.log(error.error.message);
            },
          });
      }
    });
  }

  deactivateSubAffiliate(user_id: string) {
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
        console.log(user_id);
        this.apiService.deactivateSubAffiliate(user_id).subscribe({
          next: (res: any) => {
            Swal.fire({
              timer: 5000,
              title: 'Deactivated',
              icon: 'success',
            });
            this.searchSubAfffiliate(this.searchValue, this.currentPage);
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

  activateSubAffiliate(user_id: string) {
    Swal.fire({
      title: 'Are you sure you want to activate this account?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      this.loading = true;
      if (result.isConfirmed) {
        console.log(user_id);
        this.apiService.activateSubAffiliate(user_id).subscribe({
          next: (res: any) => {
            Swal.fire({
              timer: 5000,
              title: 'Activated',
              icon: 'success',
            });
            this.searchSubAfffiliate(this.searchValue, this.currentPage);
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
}
