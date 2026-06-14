import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar';
import { LoginService } from '../../../services/auth/login-service';
import { NotificationService } from '../../../services/user/notification.service';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.css'
})
export class NotificationsPageComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private loginService = inject(LoginService);

  notifications = signal<Notification[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    const userId = this.loginService.currentUser()?.id;
    if (!userId) return;
    this.notificationService.getNotificationsByUser(userId).subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load notifications.');
        this.loading.set(false);
      }
    });
  }

  markAsRead(notification: Notification) {
    if (notification.read) return;
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      this.notifications.update(list =>
        list.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    });
  }

  markAllAsRead() {
    const unread = this.notifications().filter(n => !n.read);
    unread.forEach(n => {
      this.notificationService.markAsRead(n.id).subscribe(() => {
        this.notifications.update(list =>
          list.map(item => item.id === n.id ? { ...item, read: true } : item)
        );
      });
    });
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  unreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }
}