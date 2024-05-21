import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiServices } from '../services/api-services';
import { FirebaseService } from '../services/firebase.service';
import { Subscription, from, switchMap, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

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
    public datePipe: DatePipe
  ) {}
  title: string = 'Notifications';
  filterSelect: number = 1;
  pollingSubscription: Subscription;
  data: any;
  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    // Stop polling when the component is destroyed
    this.stopPolling();
  }

  openMessage(notif: any) {
    Swal.fire({
      // title: 'Notification Details',s
      html: this.getModalContent(notif),
      showConfirmButton: false,
      showCancelButton: true,
      // width: '70%',
      cancelButtonText: 'Close',

      customClass: {
        popup: 'w-[60%] bg-[#c8c6c6]',
        cancelButton: 'text-12 px-5 py-2 bg-danger font-bold text-white',
      },
    });
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
      .pipe(switchMap(() => this.api.getNotification()))
      .subscribe({
        next: (res: any) => {
          console.log('fetching', res.data.data);
          this.data = res.data.data;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.stopPolling();
        },
      });
  }

  stopPolling(): void {
    // Unsubscribe from the polling subscription to stop further requests
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
