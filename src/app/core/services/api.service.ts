import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api4.allhours.com/api/v1';
  
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const headers = this.getAuthHeaders(token);
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { headers, params })
          .pipe(
            catchError(error => this.handleError(error))
          );
      })
    );
  }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Authentication error. Please log in again.';
    }
    return throwError(() => new Error(errorMessage));
  }
}