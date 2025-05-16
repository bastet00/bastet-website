import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from './notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit, OnDestroy {
  showAlert = false;
  message = '';
  type: 'success' | 'warn' | 'error' = 'success';
  private subscription: Subscription;

  constructor(private notificationService: NotificationService) {
    this.subscription = this.notificationService.notification$.subscribe(
      (notification) => {
        if (notification) {
          this.showAlert = true;
          this.message = notification.message;
          this.type = notification.type;
        } else {
          this.showAlert = false;
        }
      },
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAlertClasses() {
    switch (this.type) {
      case 'success':
        return 'border-[#214017]';
      case 'warn':
        return 'border-yellow-600';
      case 'error':
        return 'border-red-600';
    }
  }
}
