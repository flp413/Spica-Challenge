import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UsersResponse, NewUserRequest } from '../models/user.model';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[] | UsersResponse>('Users').pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        } else {
          console.warn('Unexpected API response structure:', response);
          return [];
        }
      }),
      tap((users) => {
        console.log(`Mapped ${users.length} users from API response`);
      })
    );
  }

  searchUsers(searchTerm: string): Observable<User[]> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('searchQuery', searchTerm);
    }

    return this.apiService.get<User[] | UsersResponse>('Users', params).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          console.log(`Searching users with term: ${searchTerm}`);
          return response.filter(
            (user) =>
              user.FirstName.toLowerCase().startsWith(
                searchTerm.toLowerCase()
              ) ||
              user.LastName.toLowerCase().startsWith(searchTerm.toLowerCase())
          );
        } else {
          console.warn('Unexpected API response structure:', response);
          return [];
        }
      }),
      tap((users) => console.log(`Found ${users.length} users matching search`))
    );
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`Users/${id}`);
  }

  createUser(user: NewUserRequest): Observable<User> {
    console.log('Creating new user:', user);
    return this.apiService.post<User>('Users', user);
  }
}
