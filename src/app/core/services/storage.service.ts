import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly AUTH_KEY = 'auth_credentials';
  private readonly TOKEN_KEY = 'auth_token';  
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  saveAuthCredentials(clientId: string, clientSecret: string): void {
    if (!this.isBrowser) return;

    try {
      console.log('Saving credentials to localStorage');
      localStorage.setItem(
        this.AUTH_KEY,
        JSON.stringify({ clientId, clientSecret })
      );
    } catch (error) {
      console.error('Error saving auth credentials to localStorage:', error);
    }
  }

  getAuthCredentials(): { clientId: string; clientSecret: string } | null {
    if (!this.isBrowser) return null;

    try {
      const credentials = localStorage.getItem(this.AUTH_KEY);
      if (!credentials) {
        console.log('No credentials found in localStorage');
        return null;
      } else {
        console.log('Credentials retrieved from localStorage');
        return JSON.parse(credentials);
      }
    } catch (error) {
      console.error(
        'Error retrieving auth credentials from localStorage:',
        error
      );
      return null;
    }
  }

  clearAuthCredentials(): void {
    if (!this.isBrowser) return;

    console.log('Clearing credentials from localStorage');
    localStorage.removeItem(this.AUTH_KEY);
  }

  saveToken(token: string): void {
    if (!this.isBrowser) return;

    console.log('Saving token to localStorage');
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;

    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log(
      'Token retrieved from localStorage:',
      token ? 'exists' : 'not found'
    );
    return token;
  }

  clearToken(): void {
    if (!this.isBrowser) return;

    console.log('Clearing token from localStorage');
    localStorage.removeItem(this.TOKEN_KEY);
  }

  clearAll(): void {
    if (!this.isBrowser) return;

    console.log('Clearing all auth data from localStorage');
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
