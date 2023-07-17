import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from '../create-modal/create-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  
  constructor(public dialog: MatDialog) { }

  openModal(): void {
    this.dialog.open(CreateModalComponent);
  }
}
