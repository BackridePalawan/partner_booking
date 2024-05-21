import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';
import { ApiServices } from '../../services/api-services';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss',
})
export class NavHeaderComponent implements OnInit {
  constructor(private api: ApiServices) {}
  @Input() title: string;

  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  pollingSubscription: Subscription;
  data: any;
  totalNotif: number = 0;

  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    // Stop polling when the component is destroyed
    this.stopPolling();
  }

  startPolling(): void {
    // Use timer to emit values at a fixed interval
    this.pollingSubscription = timer(0, 5000)
      .pipe(switchMap(() => this.api.getUnreadNotification()))
      .subscribe({
        next: (res: any) => {
          console.log('fetching', res);
          this.data = res.data.data;
          this.totalNotif = res.data.total;
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
