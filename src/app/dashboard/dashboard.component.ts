import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  title: string = 'Dashboard';
  userDetail: any;
  constructor() {}
  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem('userDetails') ?? '');
  }
}
