import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateModalComponent } from '../create-modal/create-modal.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { AuthService } from '../auth.service';
import { PersonService } from '../person.service';
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
    private personService: PersonService,
    private router: Router,
  ) {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  openModal(): void {
    this.dialog.open(CreateModalComponent);
  }

  openAccountEdit(): void {
    this.personService.getCurrentUserPerson().subscribe({
      next: (person) => {
        const dialogRef = this.dialog.open(EditModalComponent, {
          data: { person },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log('Person updated:', result);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching current user person:', error);
        alert('Could not load your account information. You may not have a person record associated with your account.');
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Force navigation to login even if logout fails
        this.router.navigate(['/login']);
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
