import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-redirect',
  template: '', // No template is needed since we are redirecting immediately.
})
export class RedirectAndroidPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Replace with the external URL you want to redirect to.
    window.location.href =
      'https://play.google.com/store/apps/details?id=com.bastet.bastet_app';
  }
}
