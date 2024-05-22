import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { ApiServices } from './api-services';
import Swal from 'sweetalert2';

@Injectable()
export class isActiveServices implements CanActivate {
  responseuser: any;
  role: string = '';
  constructor(private api: ApiServices, private router: Router) {}

  canActivate(): boolean | Promise<boolean> {
    // return true;

    var token: any = window.localStorage.getItem('token');
    if (token !== null || token != undefined) {
      return new Promise((resolve, reject) => {
        this.api.getUserDetails().subscribe({
          next: (response) => {
            this.responseuser = response;
            console.log('hello');

            if (!this.responseuser['user']['is_active']) {
              Swal.fire({
                title:
                  'Account is not active. Please contact an admin. or Wait to activate your account',
                icon: 'warning',
                timer: 7000,
              });
              this.router.navigate(['/affiliate']);
              resolve(false);
            }

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {
            this.router.navigate(['/affiliate']);
            resolve(false);
          },
        });
      });
      // let user:any ;
      // (async() => {
      //     user = await this.getUserDetails()
      //     console.log(user, 'usdata')
      // })()
      // if (!user) {
      //     this.router.navigate(['/login'])
      // }
      // this.role = user.data.userdetails.role_name;

      // return this.role === "rental-admin";
    }
    this.router.navigate(['/login']);

    return false;
  }

  // getUserDetailsServices(token:string){
  //     this.services.getUserDetails(token).subscribe({
  //     next:(response)=>{
  //         this.responseuser = response;
  //         // this.authservice.currentUser.set(this.responseuser['data']['userdetails']);
  //         this.role = this.responseuser['data']['userdetails']['role_name'];
  //     },
  //     error:(error: HttpErrorResponse) => {

  //     }
  //     })
  // }
  // JS Promises
  getUserDetails(token: string = window.localStorage.getItem('token')!!) {
    const userDetails = this.api.getUserDetails().toPromise();
    return userDetails;
  }
}
