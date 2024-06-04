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
  isModal = false;
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

  addAffiliate() {
    this.isModal = true;
  }

  submitSubAffiliate() {
    this.isModal = false;
    this.loading = true;
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
        this.loading = false;
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
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: error.error.message,
          icon: 'error',
          timer: 2000,
        });
        this.loading = false;
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

  onPageChange(startIndex: string, page: string) {
    console.log(startIndex);
    this.currentPage = page;
    this.searchSubAfffiliate(this.searchValue, this.currentPage);
    // console.log(this.currentPage);
  }
}
