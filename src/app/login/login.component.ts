import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup = this.formBuilder.group({
    phone: [''],
    email: ['', [Validators.email]],
    password: ['', [Validators.required]],
  });

  loadingPage = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServices,
    private route: Router
  ) {}
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
