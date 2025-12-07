import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'nimloth';
  showNavbar = false;

  constructor(private router: Router) {
    // Listen to navigation changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Hide navbar on login page or root (which redirects to login)
        if (event instanceof NavigationEnd) {
          this.showNavbar = !event.url.includes('/login') && event.url !== '/';
        }
      });
  }
}
