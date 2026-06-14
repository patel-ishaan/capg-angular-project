import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/auth/login-service';
import { NotificationService } from '../../services/user/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  constructor(public loginService: LoginService) {}

  private notificationService = inject(NotificationService);

  mobileMenuOpen = false;
  unreadCount = signal(0);

  ngOnInit() {
    this.loginService.currentUser() && this.loadUnreadCount();
  }

  loadUnreadCount() {
    const userId = this.loginService.currentUser()?.id;
    if (!userId) return;
    this.notificationService.getUnreadCount(userId).subscribe({
      next: (notifications) => this.unreadCount.set(notifications.length),
      error: () => this.unreadCount.set(0)
    });
  }

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