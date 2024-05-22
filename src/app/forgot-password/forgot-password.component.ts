import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { InputOtpModule } from 'primeng/inputotp';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServices,
    private route: Router
  ) {}
  otpRequest: boolean = false;
  loadingPage: boolean = false;
  newPass: boolean = false;
  value: string | undefined;
  // phoneL: string = '';
  codeform: FormGroup = this.formBuilder.group({
    code: [null, [Validators.required]],
  });

  phoneform: FormGroup = this.formBuilder.group({
    phone: [null, [Validators.required]],
  });

  newPassword: FormGroup = this.formBuilder.group({
    password: [null, [Validators.required]],
  });

  requestOtp() {
    this.loadingPage = true;
    if (this.phoneform.invalid) {
      return;
    }
    var phonenumber =
      this.phoneform.get('phone')?.value.slice(0, 2) == '09'
        ? '+63' + this.phoneform.get('phone')?.value.slice(1)
        : this.phoneform.get('phone')?.value;

    this.phoneform.patchValue({
      phone: phonenumber,
    });

    this.apiService
      .sendOtp({ phone: this.phoneform.get('phone')?.value })
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.otpRequest = true;
          this.loadingPage = false;
        },
        error: (error: HttpErrorResponse) => {
          this.otpRequest = true;
          this.loadingPage = false;
        },
      });

    console.log(this.phoneform.value);
  }

  verifyOtp() {
    if (this.codeform.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Please Input The OTP Code',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (this.codeform.get('code')?.value.length != 6) {
      let digits =
        this.codeform.get('code')?.value.length == 1
          ? '1 digit'
          : this.codeform.get('code')?.value.length + ' digits';
      Swal.fire({
        title: 'Error!',
        text:
          'Please enter a 6-digit OTP code. The code you entered is ' +
          digits +
          'long. Make sure to provide the correct 6-digit OTP code to proceed.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    this.loadingPage = true;
    this.apiService
      .verifyOtp({
        phone: this.phoneform.get('phone')?.value,
        code: this.codeform.get('code')?.value,
      })
      .subscribe({
        next: (res) => {
          this.newPass = true;
          this.loadingPage = false;
          this.otpRequest = false;
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          });
          // this.register();
          this.loadingPage = false;
        },
      });
  }

  changePassword() {
    console.log({
      phone: this.phoneform.get('phone'),
      password: this.newPassword.get('password'),
    });
    this.loadingPage = true;
    this.apiService
      .forgotPassword({
        phone: this.phoneform.get('phone')?.value,
        password: this.newPassword.get('password')?.value,
      })
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            title: res.message,
            icon: 'success',
            timer: 5000,
          });
          this.route.navigate(['/login']);
          this.loadingPage = false;
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
            timer: 5000,
          });
          this.loadingPage = false;
        },
      });
  }
}
