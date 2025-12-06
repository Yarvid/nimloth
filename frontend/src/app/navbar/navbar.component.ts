import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateModalComponent } from '../create-modal/create-modal.component';
import { AuthService } from '../auth.service';
import { IUser } from '../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  currentUser: IUser | null = null;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  openModal(): void {
    this.dialog.open(CreateModalComponent);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
