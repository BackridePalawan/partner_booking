import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-driver-search',
  templateUrl: './driver-search.component.html',
  styleUrl: './driver-search.component.scss',
})
export class DriverSearchComponent {
  @Input() inputData: any;
}
