import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServices } from '../../services/api-services';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.scss',
})
export class DriverDetailsComponent implements OnInit {
  loading: boolean = true;
  title = 'Driver Details';
  driver_id = '';
  driverDetails: any;

  constructor(private route: ActivatedRoute, private api: ApiServices) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params['driverId'] as string;
      this.driver_id = code;
    });
    console.log(this.driver_id);
    this.getDriverDetails();
  }

  getDriverDetails() {
    this.api.getDriverDetails(this.driver_id).subscribe({
      next: (res) => {
        this.driverDetails = res;
        console.log('driver details', res);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.message);
        this.loading = false;
      },
    });
  }
}
