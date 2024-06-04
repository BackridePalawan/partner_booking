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
    // console.log('this is the token:' + token);
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
    console.log(book);
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

  getActiveBranch() {
    return this.http.get(`${this.Root_URL_API}branches`, {
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

  addAffiliateBook(data: { order_id: string }) {
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
  getEarningsAndOrders(data: any, page: string) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/earnings/EarningOrders?page=${page}`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  cancelBooking(orderID: string, reason: string) {
    return this.http.get(
      `${this.Root_URL_API}taxi/order/cancel/${orderID}?reason=${reason}`,

      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getNotification(page: string, status: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate/notifications?page=${page}&status=${status}`,

      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getUnreadNotification() {
    return this.http.get(
      `${this.Root_URL_API}affiliate/unread-notifications`,

      {
        headers: this.getTokenHeader(),
      }
    );
  }

  async getBooking(idCode: string) {
    return new Promise((resolve, reject) => {
      fetch(this.Root_URL_API + `booking/${idCode}`, {
        headers: { ...this.getHeaders() },
      })
        .then((res) => res.json())
        .then((u) => {
          resolve(u);
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  }

  async getPolyline(origin: string, destination: string) {
    console.log(origin, destination);
    return new Promise((resolve, reject) => {
      fetch(
        this.baseUrl + `polylines?origin=${origin}&destination=${destination}`,
        {
          headers: { ...this.getHeaders() },
        }
      )
        .then((res) => res.json())
        .then((u) => {
          resolve(u);
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  }

  getProfilePicture() {
    return this.http.get(
      `${this.Root_URL_API}affiliate-partner/view-profile-pic`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  changeProfilePic(data: any) {
    return this.http.post(
      `${this.Root_URL_API}affiliate-partner/change-profile-pic`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  changePassword(data: any) {
    return this.http.put(`${this.Root_URL_API}profile/password/update`, data, {
      headers: this.getTokenHeader(),
    });
  }

  markAsRead(id: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate/notifications/${id}/read`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  forgotPassword(data: any) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/forgot/password`,
      data
    );
  }

  getGeocoder() {
    return {
      forward: async (latitude: number, longitude: number) => {
        return new Promise((resolve, reject) => {
          // fetch(this.baseUrl + `cu/forward?lat=${latitude}&lng=${longitude}`, {
          //   headers: this.getHeaders(),
          // })
          //   .then((res) => res.json())
          //   .then((u) => {
          //     resolve(u)
          //   })
          //   .catch((err) => {
          //     reject(err.message)
          //   })
          resolve({
            data: [{ formatted_address: '' }],
          });
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
      reverseOriginal: async (keyword: string) => {
        return new Promise((resolve, reject) => {
          fetch(this.baseUrl + `geocoder/reverse?keyword=${keyword}`, {
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

  getVehicleEstimatePrice(pickup: string, dropoff: string) {
    return this.http.get(
      `${this.Root_URL_API}vehicle/types/pricing?type=ride&pickup=${pickup}&dropoff=${dropoff}&country_code=ph`,
      {
        headers: this.getTokenHeader(),
      }
    );
    // http://192.168.254.159:8000/api/vehicle/types/pricing?type=ride&pickup=8.180530222236891%2C,126.36131990700959&dropoff=8.18154439907801%2C,126.356032602489&country_code=ph
  }

  sendBookingDetails(data: any) {
    return this.http.post(
      `${this.Root_URL_API}affiliate-partner/send-book-details`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  searchBookingOrder(page: string, data: any) {
    return this.http.post(
      `${this.Root_URL_API}affiliate-partner/search-order?page=${page}`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getMonthEarnAndFee(data: any) {
    return this.http.post(
      `${this.Root_URL_API}affiliate-partner/monthEarnings`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getDrivers(search: string, page: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate/get-drivers?page=${page}&search=${search}`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  deactivateDriver(driverId: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate/deactivate-driver/${driverId}`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  activateDriver(driverId: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate/activate-driver/${driverId}`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  addSubAffiliate(data: any) {
    return this.http.post(
      `${this.Root_URL_API}affiliate/add-sub-affliate`,
      data,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getSubAffiliate(searchValue: string, page: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate/get-sub-affliate?page=${page}&searchValue=${searchValue}`,

      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getSubAffiliateDetails() {
    return this.http.get(
      `${this.Root_URL_API}affiliate/get-sub-affliate/details`,

      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getEarningsFromSubAffiliate() {
    return this.http.get(
      `${this.Root_URL_API}affiliate/earnings-from-sub-affiliate`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }

  getDriverDetails(driverId: string) {
    return this.http.get(
      `${this.Root_URL_API}affiliate/get-drivers-info??driver_id=${driverId}`,
      {
        headers: this.getTokenHeader(),
      }
    );
  }
}
