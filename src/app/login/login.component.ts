import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  submitted = false;
  form: FormGroup = this.formBuilder.group({
    user: ['', Validators.required],
    password: ['', [Validators.required]],
  });

  loadingPage = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServices,
    private route: Router
  ) {}

  login() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loadingPage = true;
    // console.log(this.form.value);
    if (Number(this.form.get('user')?.value)) {
      if (this.form.get('user')?.value.slice(0, 2) == '09') {
        this.loggingIn({
          phone: '+63' + this.form.get('user')?.value.slice(1),
          password: this.form.get('password')?.value,
        });
      } else {
        this.loggingIn({
          phone: this.form.get('user')?.value,
          password: this.form.get('password')?.value,
        });
      }
    } else {
      this.loggingIn({
        email: this.form.get('user')?.value,
        password: this.form.get('password')?.value,
      });
    }
  }

  loggingIn(credentials: any) {
    this.apiService.login(credentials).subscribe({
      next: (res: any) => {
        console.log('login', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role_name);
        // localStorage.setItem('token', res.token);
        this.route.navigate(['/affiliate']);

        this.loadingPage = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        Swal.fire({
          title: error.error.message,
          icon: 'error',
          timer: 7000,
          showConfirmButton: false,
        });
        this.loadingPage = false;
      },
    });
  }
}
