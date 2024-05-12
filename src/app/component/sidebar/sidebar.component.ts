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
        this.userDetail = res;
        localStorage.setItem(
          'userDetails',
          JSON.stringify(this.userDetail.user)
        );
        this.loadData = false;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
}
