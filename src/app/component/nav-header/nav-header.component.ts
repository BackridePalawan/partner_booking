import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';
import { ApiServices } from '../../services/api-services';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss',
})
export class NavHeaderComponent implements OnInit {
  constructor(
    private api: ApiServices,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private route: Router
  ) {}
  @Input() title: string;

  showDropdown = false;
  submitted = false;
  visible: boolean = false;
  is_subAffilliate: boolean = false;
  subAffilliateFee: string = '0';
  subAffilliateEarningPercentage: string = '0%';
  visible2: boolean = false;

  buttonText = 'Change';

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  pollingSubscription: Subscription;
  data: any[];
  totalNotif: number = 0;
  profileLink: any;
  editLink: any;
  loadingPage: boolean = true;
  buttonLoadingPage: boolean = false;
  form: FormGroup = this.formBuilder.group({
    profile: ['', Validators.required],
  });
  passwordChange: FormGroup = this.formBuilder.group({
    password: ['', Validators.required],
    new_password: ['', Validators.required],
    new_password_confirmation: ['', Validators.required],
  });

  ngOnInit(): void {
    this.startPolling();
    this.getUserDetails();
    this.getSubAffiliateDetails();
  }

  show(notif: any) {
    // console.log(notif);
    this.messageService.add({
      severity: 'info',
      summary: notif.title,
      detail: this.datePipe.transform(notif.created_at, 'HH:mm')?.toString(),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form!.patchValue({
        profile: file,
      });
      this.form!.get('profile')!.updateValueAndValidity();

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.editLink = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
          // console.log('fetching', res);
          const timenow = this.datePipe.transform(new Date(), 'HH:mm');
          this.data = res.data.data;
          this.totalNotif = res.data.total;
          this.data.filter((ele) => {
            if (timenow == this.datePipe.transform(ele.created_at, 'HH:mm')) {
              this.show(ele);
            }
          });
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

  getUserDetails() {
    this.api.getProfilePicture().subscribe({
      next: (res: any) => {
        this.profileLink = res.file_url;
        this.editLink = res.file_url;
        this.loadingPage = false;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  showDialog() {
    this.visible = true;
  }
  showDialog2() {
    this.visible2 = true;
  }

  profileChange() {
    if (this.buttonText == 'Loading ....') {
      return;
    }
    this.buttonText = 'Loading ....';

    const submitData = new FormData();
    const profile = this.form?.get('profile')?.value;
    if (profile) {
      submitData.append('profile', profile);
    }

    this.api.changeProfilePic(submitData).subscribe({
      next: (res: any) => {
        this.profileLink = res.file_url;
        this.editLink = res.file_url;
        this.visible = false;
        Swal.fire({
          title: 'Profile Changed',
          icon: 'success',
          timer: 2000,
        });
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          timer: 2000,
        });
      },
    });
  }

  changePassword() {
    if (this.buttonLoadingPage) {
      return;
    }
    this.submitted = true;
    this.buttonLoadingPage = true;

    console.log(this.passwordChange.value);
    this.api.changePassword(this.passwordChange.value).subscribe({
      next: (res: any) => {
        this.visible2 = false;
        this.submitted = false;
        Swal.fire({
          title: res.message,
          icon: 'success',
          timer: 2000,
        });
        this.passwordChange.patchValue({
          password: '',
          new_password: '',
          new_password_confirmation: '',
        });
        this.buttonLoadingPage = false;
        console.log('hello');
      },
      error: (error: HttpErrorResponse) => {
        this.visible2 = false;
        Swal.fire({
          title: error.error.message,
          icon: 'error',
        }).then(() => {
          this.visible2 = true;
        });
        console.log(error);
        this.buttonLoadingPage = false;
      },
    });
  }

  logout() {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.route.navigate(['/']);
      }
    });
  }

  getSubAffiliateDetails() {
    this.api.getSubAffiliateDetails().subscribe({
      next: (res: any) => {
        this.is_subAffilliate = res.is_subAffilliate;
        console.log('this is sub affiliate', res);
        if (this.is_subAffilliate) {
          this.subAffilliateFee = this.transform(res.details.sub_affiliate_fee);
          this.subAffilliateEarningPercentage = `${res.details.earning_percentage}%`;
          return;
        }

        console.log(res);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  transform(value: number): string {
    if (value == null) return '';
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
}
