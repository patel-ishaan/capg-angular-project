import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/auth/login-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  constructor(public loginService: LoginService) {}

  mobileMenuOpen = false;
  logout() {
    this.loginService.logout();
  }
  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  closeMenu() {
    this.mobileMenuOpen = false;
  }
}
