import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServices } from '../services/api-services';
import { FirebaseService } from '../services/firebase.service';
import { Subscription, from, switchMap, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiServices,
    private fb: FirebaseService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {}
  title: string = 'Notifications';
  filterSelect: number = 1;
  selectedPage: number = 1;
  isSubAffiliate: boolean = true;
  subAffiliateOnly: boolean = false;
  driverOnly: boolean = false;
  sendNotifications: boolean = false;
  isAll: boolean = true;
  fromPage: string = '1';
  toPage: string = '';
  status: string = 'any';
  pollingSubscription: Subscription;
  data: any[] = [];
  loadingPage: boolean = true;

  form: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    message: ['', [Validators.required]],
    isSubAffiliate: [this.subAffiliateOnly, [Validators.required]],
    isDriver: [this.driverOnly, [Validators.required]],
    isAll: [this.isAll, [Validators.required]],
  });

  ngOnInit(): void {
    this.startPolling();
    this.getUserDetails();
  }

  ngOnDestroy(): void {
    // Stop polling when the component is destroyed
    this.stopPolling();
  }

  openMessage(notif: any) {
    console.log(notif.id);
    if (notif.is_read) {
      Swal.fire({
        // title: 'Notification Details',s
        html: this.getModalContent(notif),
        showConfirmButton: false,
        showCancelButton: true,
        // width: '70%',~
        cancelButtonText: 'Close',

        customClass: {
          popup: 'w-[60%] bg-[#c8c6c6]',
          cancelButton: 'text-12 px-5 py-2 bg-danger font-bold text-white',
        },
      });
      return;
    }
    this.api.markAsRead(notif.id).subscribe({
      next: (res: any) => {
        console.log(res);
        Swal.fire({
          // title: 'Notification Details',s
          html: this.getModalContent(notif),
          showConfirmButton: false,
          showCancelButton: true,
          // width: '70%',~
          cancelButtonText: 'Close',

          customClass: {
            popup: 'w-[60%] bg-[#c8c6c6]',
            cancelButton: 'text-12 px-5 py-2 bg-danger font-bold text-white',
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: error.error.message,
          icon: 'warning',
          timer: 5000,
        });
      },
    });
  }

  next() {
    if (this.selectedPage.toString() == this.toPage.toString()) {
      return;
    }
    this.selectedPage = this.selectedPage + 1;
    console.log('stop');
    this.loadingPage = true;
    this.stopPolling();
    console.log('go');
    this.startPolling();
  }

  prev() {
    if (this.selectedPage.toString() == this.fromPage.toString()) {
      return;
    }
    this.selectedPage = this.selectedPage - 1;
    console.log('stop');
    this.loadingPage = true;
    this.stopPolling();
    console.log('go');
    this.startPolling();
  }

  getModalContent(notif: any): string {
    return `
              <div class="p-4 md:p-5 space-y-4 bg-[#c8c6c6]">
                <div class="w-full h-full flex justify-center items-center">
                  <div class="p-4 w-full shadow-lg rounded-lg bg-white modalBorder">
                    <p>${notif.content}</p>
                  </div>
                </div>
              </div>

            `;
  }

  startPolling(): void {
    // Use timer to emit values at a fixed interval
    this.pollingSubscription = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.api.getNotification(this.selectedPage.toString(), this.status)
        )
      )
      .subscribe({
        next: (res: any) => {
          console.log(res);
          console.log('fetching', res.data.data);
          this.toPage = res.data.last_page.toString();
          this.data = res.data.data;
          this.loadingPage = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.stopPolling();
        },
      });
  }

  all() {
    this.filterSelect = 1;
    this.loadingPage = true;
    this.status = 'any';
    this.stopPolling();
    this.startPolling();
  }

  read() {
    this.filterSelect = 2;
    this.loadingPage = true;
    this.status = 'read';
    this.stopPolling();
    this.startPolling();
  }

  unRead() {
    this.filterSelect = 3;
    this.loadingPage = true;
    this.status = 'unread';
    this.stopPolling();
    this.startPolling();
  }

  stopPolling(): void {
    // Unsubscribe from the polling subscription to stop further requests
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  getUserDetails() {
    this.api.getUserDetails().subscribe({
      next: (res: any) => {
        if (res.user.role_name === 'affiliate-partner') {
          this.isSubAffiliate = false;
        }
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  allSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.checked);
    // console.log(this.form.value);
    this.subAffiliateOnly = false;
    this.driverOnly = false;
  }
  subAffiliateOnlySelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.checked);
    // console.log(this.form.value);
    this.isAll = false;
    this.driverOnly = false;
  }
  driverOnlySelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.checked);
    // console.log(this.form.value);
    this.subAffiliateOnly = false;
    this.isAll = false;
  }

  submit() {
    if (this.form.valid) {
      return;
    }
    this.api.sendNotification(this.form.valid).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Notification Sent',
          icon: 'success',
          timer: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: error.error.message,
          icon: 'error',
          timer: 3000,
        });
      },
    });
  }
}
