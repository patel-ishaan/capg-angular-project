import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  mobileMenuOpen = false;
  toggleMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMenu()  { this.mobileMenuOpen = false; }
}