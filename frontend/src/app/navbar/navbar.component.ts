import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { CreateModalComponent } from '../create-modal/create-modal.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { AuthService } from '../auth.service';
import { PersonService } from '../person.service';
import { ViewStateService, ViewMode } from '../view-state.service';
import { IUser } from '../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonToggleModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: IUser | null = null;
  currentViewMode: ViewMode = 'grid';

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private personService: PersonService,
    private viewStateService: ViewStateService,
    private router: Router,
  ) {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.viewStateService.viewMode$.subscribe((mode) => {
      this.currentViewMode = mode;
    });
  }

  openModal(): void {
    this.dialog.open(CreateModalComponent);
  }

  openAccountEdit(): void {
    this.personService.getCurrentUserPerson().subscribe({
      next: (person) => {
        this.dialog.open(EditModalComponent, {
          data: { person },
        });
      },
      error: () => {
        alert(
          'Could not load your account information. You may not have a person record associated with your account.',
        );
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Force navigation to login even if logout fails
        this.router.navigate(['/login']);
      },
    });
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewStateService.setViewMode(mode);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
