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
          role: 'affiliate-partner',
        });
      } else {
        this.loggingIn({
          phone: this.form.get('user')?.value,
          password: this.form.get('password')?.value,
          role: 'affiliate-partner',
        });
      }
    } else {
      this.loggingIn({
        email: this.form.get('user')?.value,
        password: this.form.get('password')?.value,
        role: 'affiliate-partner',
      });
    }
  }

  loggingIn(credentials: any) {
    this.apiService.login(credentials).subscribe({
      next: (res: any) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.route.navigate(['/affiliate']);

        this.loadingPage = false;
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          title: 'Error!',
          text: 'Server Error',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
        });
        this.loadingPage = false;
      },
    });
  }
}
