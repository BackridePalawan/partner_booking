import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import constants from '../../constants';

@Injectable({ providedIn: 'root' })
export class ApiServices {
  constructor(private http: HttpClient) {}
  readonly Root_URL = 'http://localhost:8000';

  readonly Root_URL_API = this.Root_URL + '/api/';
  public baseUrl = constants.apiUrl;

  getTokenHeader(): HttpHeaders {
    const token: any = localStorage.getItem('token');
    console.log('this is the token:' + token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getHeaders(withContentType: boolean = true): any {
    if (localStorage.getItem('token')) {
      if (withContentType) {
        return {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          platform: 'android',
        };
      }

      return {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': '*',
        platform: 'android',
      };
    }

    return {};
  }

  getMyGeocoder() {
    return {
      forward: async (latitude: number, longitude: number) => {
        return new Promise((resolve, reject) => {
          fetch(this.baseUrl + `cu/forward?lat=${latitude}&lng=${longitude}`, {
            headers: this.getHeaders(),
          })
            .then((res) => res.json())
            .then((u) => {
              resolve(u);
            })
            .catch((err) => {
              reject(err.message);
            });
          // resolve({
          //   data: [{ formatted_address: '' }],
          // });
        });
      },
      reverse: async (keyword: string) => {
        return new Promise((resolve, reject) => {
          fetch(this.baseUrl + `cu/reverse?keyword=${keyword}`, {
            headers: this.getHeaders(),
          })
            .then((res) => res.json())
            .then((u) => {
              resolve(u);
            })
            .catch((err) => {
              reject(err.message);
            });
        });
      },
    };
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

  booking(book: any) {
    // console.log(this.Root_URL_API + 'taxi/book/order');
    return this.http.post(this.Root_URL_API + 'taxi/book/order', book, {
      headers: this.getTokenHeader(),
    });
  }

  findAvailableDriver(pickup: string, dropoff: string, vehicleTypeID: string) {
    return this.http.get(
      `${this.Root_URL_API}vehicle/${vehicleTypeID}/find_available?pickup=${pickup}&dropoff=${dropoff}&type='ride'`,

      {
        headers: this.getTokenHeader(),
      }
    );
  }

  findVehicleTypes(vehicleTypeId: string) {
    return this.http.get(
      this.Root_URL_API + 'vehicle/types?branch_id=' + vehicleTypeId,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getUserDetails() {
    return this.http.get(`${this.Root_URL_API}user`, {
      headers: this.getTokenHeader(),
    });
  }

  getAffiliateOrders(page: string, status: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate-partner/orders/${status}?page=${page}`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getOrderDetails(orderID: string) {
    return this.http.get(`${this.Root_URL_API}orders/${orderID}`, {
      headers: this.getTokenHeader(),
    });
  }

  addAffiliateBook(data: { order_id: string; commission: string }) {
    return this.http.post(`${this.Root_URL_API}affiliate/book`, data, {
      headers: this.getTokenHeader(),
    });
  }

  getAffiliateCommision() {
    return this.http.get(`${this.Root_URL_API}affiliate/commission`, {
      headers: this.getTokenHeader(),
    });
  }

  getEarnings(data: any, page: string) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/earnings?page=${page}`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }
  getEarningsWeekly(data: any, page: string) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/earnings/weekly?page=${page}`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }
  getEarningsMonthly(data: any, page: string) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/earnings/monthly?page=${page}`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }
  getEarningsYearly(data: any, page: string) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/earnings/yearly?page=${page}`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getEarningsOrders(data: any, page: string) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/earnings/orders?page=${page}`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }
}
