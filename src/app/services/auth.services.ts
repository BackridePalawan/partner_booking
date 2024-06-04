import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { ApiServices } from './api-services';

@Injectable()
export class AuthGuardServices implements CanActivate {
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
            this.role = this.responseuser['user']['role_name'];
            if (this.role === 'sub-affiliate-partner') {
              resolve(true);
            } else if (this.role === 'affiliate-partner') {
              resolve(true);
            } else {
              this.router.navigate(['/']);
              resolve(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.router.navigate(['/login']);
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
