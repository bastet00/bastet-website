import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-redirect',
  template: `
    <div
      style="text-align: center; padding: 20px; font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;"
    >
      <h2>Redirecting to App Store...</h2>
      <p>
        If you are not redirected automatically, please click the button below:
      </p>
      <div id="redirect-link"></div>
      <div style="margin-top: 20px;">
        <button
          id="manual-redirect"
          style="background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer;"
        >
          Download App
        </button>
      </div>
    </div>
  `,
})
export class RedirectBastetAppDownloadPageComponent implements OnInit {
  iosLink =
    'https://apps.apple.com/us/app/bastet-hieroglyph-translator/id6747642027';
  androidLink =
    'https://play.google.com/store/apps/details?id=com.bastet.bastet_app';

  constructor() {}

  ngOnInit(): void {
    // Add a longer delay to ensure the page loads properly before redirecting
    setTimeout(() => {
      this.redirectToAppStore();
    }, 1000);
  }

  private redirectToAppStore(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    let redirectUrl = this.androidLink; // Default fallback

    // More comprehensive mobile device detection
    if (/iphone|ipad|ipod/.test(userAgent)) {
      // iOS device
      redirectUrl = this.iosLink;
    } else if (/android/.test(userAgent)) {
      // Android device
      redirectUrl = this.androidLink;
    } else {
      // Desktop detection
      if (/win/.test(platform)) {
        // Windows desktop - redirect to Android store
        redirectUrl = this.androidLink;
      } else if (/mac/.test(platform)) {
        // macOS desktop - redirect to iOS store (Mac users can use iOS apps)
        redirectUrl = this.iosLink;
      } else {
        // Default fallback - redirect to Android store
        redirectUrl = this.androidLink;
      }
    }

    // Update the visible link for manual clicking
    const linkElement = document.getElementById('redirect-link');
    if (linkElement) {
      linkElement.innerHTML = `<a href="${redirectUrl}" style="color: #007AFF; text-decoration: none; font-size: 18px;">Click here to download the app</a>`;
    }

    // Add manual redirect button functionality
    const manualButton = document.getElementById('manual-redirect');
    if (manualButton) {
      manualButton.addEventListener('click', () => {
        this.performRedirect(redirectUrl);
      });
    }

    // Try multiple redirect methods for better compatibility
    this.performRedirect(redirectUrl);
  }

  private performRedirect(url: string): void {
    // Method 1: Try window.open() first (better for mobile)
    try {
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        return;
      }
    } catch (_) {
      // Silent fail
    }

    // Method 2: Try location.href
    try {
      window.location.href = url;
    } catch (_) {
      // Silent fail
    }

    // Method 3: Try location.replace() as fallback
    try {
      window.location.replace(url);
    } catch (_) {
      // Silent fail
    }
  }
}
