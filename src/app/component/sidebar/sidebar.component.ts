import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiServices } from '../../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import constants from '../../../constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebar') sidebar: ElementRef;
  @ViewChild('sidebarToggleBtn') sidebarToggleBtn: ElementRef;

  constructor(private apiService: ApiServices) {}
  userDetail: any;
  is_active: boolean = false;
  loadData: boolean = true;
  ngOnInit(): void {
    this.getUserDetails();
  }
  toggleSidebar() {
    this.sidebar.nativeElement.classList.toggle('-translate-x-full');
  }

  closeSidebar() {
    this.sidebar.nativeElement.classList.toggle('-translate-x-full');
  }

  getUserDetails() {
    this.apiService.getUserDetails().subscribe({
      next: (res) => {
        console.log('userDetails', res);
        this.userDetail = res;
        this.is_active = this.userDetail.user.is_active;
        console.log(this.is_active);
        localStorage.setItem('branch_id', this.userDetail.user.branch_id);
        this.loadData = false;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
}
