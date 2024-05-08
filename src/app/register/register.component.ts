import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  imageUrl = 'assets/images/camera.jpg';

  submitted = false;
  loadingPage = false;
  otpRequest = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServices,
    private route: Router
  ) {}

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    userImage: ['', Validators.required],
  });

  Otpform: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form!.patchValue({
        userImage: file,
      });
      this.form!.get('userImage')!.updateValueAndValidity();

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    this.submitted = true;

    if (this.form.get('userImage')!.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Please Upload A User Photo',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
    if (this.form.invalid) {
      return;
    }

    var phonenumber =
      this.form.get('phone')?.value.slice(0, 2) == '09'
        ? '+63' + this.form.get('phone')?.value.slice(1)
        : this.form.get('phone')?.value;

    this.form.patchValue({
      phone: phonenumber,
    });

    // this.otpRequest = true;
    // console.log(this.form.value);
    this.loadingPage = true;

    this.apiService.sendOtp({ phone: phonenumber }).subscribe({
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
  }

  verifyOtp() {
    if (this.Otpform.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Please Input The OTP Code',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (this.Otpform.get('code')?.value.length != 6) {
      let digits =
        this.Otpform.get('code')?.value.length == 1
          ? '1 digit'
          : this.Otpform.get('code')?.value.length + ' digits';
      Swal.fire({
        title: 'Error!',
        text:
          'Please enter a 5-digit OTP code. The code you entered is ' +
          digits +
          'long. Make sure to provide the correct 5-digit OTP code to proceed.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    this.loadingPage = true;
    this.apiService
      .verifyOtp({
        phone: this.form.get('phone')?.value,
        code: this.Otpform.get('code')?.value,
      })
      .subscribe({
        next: (res) => {
          this.register();
          // console.log(this.form.value);
          // this.loadingPage = false;
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          });
          this.loadingPage = false;
        },
      });
  }

  register() {
    this.apiService.register(this.form.value).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'Success',
          text: res['message'],
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this.login();
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        });
      },
    });
  }

  login() {
    this.apiService
      .login({
        phone: this.form.get('phone')!.value,
        password: this.form.get('password')!.value,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.route.navigate(['/affiliate']);
          this.loadingPage = false;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }
}
