import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  @Input() showAlert: boolean = false;
  @Input() message: string = '';
  @Input() type: NotificationType = 'success';

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
