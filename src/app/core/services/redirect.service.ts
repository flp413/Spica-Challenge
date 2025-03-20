import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  checkAuthAndRedirect(): boolean {
    const isAuthenticated = this.authService['tokenSubject'].getValue();
    if (!isAuthenticated) {
      this.router.navigate(['/settings']);
      return false;
    }
    return true;
  }
}