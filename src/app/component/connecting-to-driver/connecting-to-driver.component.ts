import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-connecting-to-driver',
  templateUrl: './connecting-to-driver.component.html',
  styleUrl: './connecting-to-driver.component.scss',
})
export class ConnectingToDriverComponent {
  @Input() driverDetails: any;
}
