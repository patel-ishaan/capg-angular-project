import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private BASE_URL = 'http://localhost:3000';
  private http = inject(HttpClient);

  getNotificationsByUser(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.BASE_URL}/notifications?userId=${userId}`
    );
  }

  getAdminNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.BASE_URL}/notifications?category=admin`
    );
  }

  markAsRead(notificationId: string): Observable<Notification> {
    return this.http.patch<Notification>(
      `${this.BASE_URL}/notifications/${notificationId}`,
      { read: true }
    );
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.get<Notification[]>(
      `${this.BASE_URL}/notifications?userId=${userId}&read=false`
    ).pipe(
      // handled in component
    ) as any;
  }

  createNotification(notification: Omit<Notification, 'id'>): Observable<Notification> {
    return this.http.post<Notification>(
      `${this.BASE_URL}/notifications`,
      notification
    );
  }

  getUnreadCount(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.BASE_URL}/notifications?userId=${userId}&read=false`
    );
  }
}