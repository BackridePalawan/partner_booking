import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @ViewChild('sidebar') sidebar: ElementRef;
  @ViewChild('sidebarToggleBtn') sidebarToggleBtn: ElementRef;

  toggleSidebar() {
    this.sidebar.nativeElement.classList.toggle('-translate-x-full');
  }

  closeSidebar() {
    this.sidebar.nativeElement.classList.toggle('-translate-x-full');
  }
}
