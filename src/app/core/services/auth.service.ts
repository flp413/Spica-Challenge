import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthResponse } from '../models/auth.module';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenUrl = 'https://login.allhours.com/connect/token';
  
  // BehaviorSubject for tracking the current token state
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();
  
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  constructor() {
    // initialize from storage if available
    const savedToken = this.storageService.getToken();
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }

  // get valid token - from cache or by authenticating
  getToken(): Observable<string> {
    const currentToken = this.tokenSubject.value;
    if (currentToken) {
      return of(currentToken);
    }
    return this.authenticate();
  }

  private authenticate(): Observable<string> {
    const credentials = this.storageService.getAuthCredentials();
    
    if (!credentials) {
      return throwError(() => new Error('No authentication credentials found. Please configure your API settings.'));
    }
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', credentials.clientId)
      .set('client_secret', credentials.clientSecret)
      .set('scope', 'api');

    return this.http.post<AuthResponse>(this.tokenUrl, body.toString(), { headers })
      .pipe(
        tap(response => {
          // console.log('Authentication successful, token received');
          this.storageService.saveToken(response.access_token);
          this.tokenSubject.next(response.access_token);
        }),
        map(response => response.access_token),
        catchError(error => {
          console.error('Authentication error', error);
          return throwError(() => new Error('Failed to authenticate. Please check your credentials.'));
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return of(!!this.tokenSubject.value);
  }

  logout(): void {
    this.storageService.clearToken();
    this.tokenSubject.next(null);
  }
}