import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { LoginService } from '../../services/auth/login-service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
})
export class AdminLayout {
  menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/claims', icon: '📋', label: 'Claims Review' },
    { path: '/admin/policies', icon: '📄', label: 'Policy Management' },
    { path: '/admin/payments', icon: '💰', label: 'Payment Overview' },
    { path: '/admin/users', icon: '👥', label: 'Users List' },
  ];

  isSidebarCollapsed = false;

  constructor(
    private authService: LoginService,
    private router: Router,
  ) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.isSidebarCollapsed));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) this.isSidebarCollapsed = saved === 'true';
  }

  get currentTitle(): string {
    const path = this.router.url;
    const item = this.menuItems.find((i) => path.includes(i.path));
    return item ? item.label : 'Dashboard';
  }
}
