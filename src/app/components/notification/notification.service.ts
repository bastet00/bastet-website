import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'warn' | 'error';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationSubject.asObservable();

  show(notification: Notification) {
    this.notificationSubject.next(notification);

    if (notification.duration) {
      setTimeout(() => {
        this.hide();
      }, notification.duration);
    }
  }

  hide() {
    this.notificationSubject.next(null);
  }

  success(message: string, duration: number = 3000) {
    this.show({ message, type: 'success', duration });
  }

  warn(message: string, duration: number = 3000) {
    this.show({ message, type: 'warn', duration });
  }

  error(message: string, duration: number = 3000) {
    this.show({ message, type: 'error', duration });
  }
}
