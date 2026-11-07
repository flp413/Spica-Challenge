import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.request(headers =>
      this.http.get<T>(`${this.baseUrl}/${endpoint}`, { headers, params })
    );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.request(headers =>
      this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers })
    );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.request(headers =>
      this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { headers })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.request(headers =>
      this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { headers })
    );
  }

  // sends the request with the current token; if the token has expired (401),
  // gets a new one with the saved credentials and tries once more
  private request<T>(send: (headers: HttpHeaders) => Observable<T>): Observable<T> {
    const withToken = () =>
      this.authService.getToken().pipe(
        switchMap(token => send(this.getAuthHeaders(token)))
      );

    return withToken().pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.logout();
          return withToken();
        }
        return throwError(() => error);
      }),
      catchError(error => this.handleError(error))
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
    let errorMessage = error?.message || 'An unknown error occurred';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Authentication error. Please log in again.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
