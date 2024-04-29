import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiServices {
  constructor(private http: HttpClient) {}
  readonly Root_URL = 'https://click-julie-waves-sprint.trycloudflare.com';

  readonly Root_URL_API = this.Root_URL + '/api/';

  getTokenHeader(): HttpHeaders {
    const token: any = localStorage.getItem('token');
    console.log('this is the token:' + token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  sendOtp(otp: { phone: string }) {
    return this.http.post(this.Root_URL_API + 'otp/send', otp);
  }

  verifyOtp(otp: { phone: string; code: string }) {
    return this.http.post(this.Root_URL_API + 'otp/verify', otp);
  }

  register(user: any) {
    return this.http.post(
      this.Root_URL_API + 'affiliate-partner/register',
      user
    );
  }

  login(user: any) {
    return this.http.post(this.Root_URL_API + 'login', user);
  }
}
