import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AbsenceDefinition,
  AbsenceDefinitionApiResponse,
  Absence,
  AbsenceApiResponse,
  NewAbsenceRequest,
} from '../models/absence.model';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private readonly apiService = inject(ApiService);

  getAllAbsenceDefinitions(): Observable<AbsenceDefinition[]> {
    return this.apiService
      .get<AbsenceDefinition[] | AbsenceDefinitionApiResponse>(
        'AbsenceDefinitions'
      )
      .pipe(
        tap((response) =>
          console.log('Raw absence definitions response:', response)
        ),
        map((response) => {
          if (Array.isArray(response)) {
            return response;
          } else {
            console.warn(
              'Unexpected API response structure for absence definitions:',
              response
            );
            return [];
          }
        })
      );
  }

  createAbsence(absence: NewAbsenceRequest): Observable<Absence> {
    return this.apiService
      .post<Absence>('Absences', absence)
      .pipe(tap((response) => console.log('Created absence:', response)));
  }

  getAbsenceById(id: string): Observable<Absence> {
    return this.apiService.get<Absence>(`Absences/${id}`);
  }

  deleteAbsence(id: string): Observable<void> {
    return this.apiService.delete<void>(`Absences/${id}`);
  }

  getAbsencesForDate(date: string): Observable<Absence[]> {
    const params = new HttpParams().set('date', date);
    return this.apiService
      .get<Absence[] | AbsenceApiResponse>('Absences', params)
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            console.log(
              'Filtering',
              response.filter(
                (absence) =>
                  absence.Timestamp.split('T')[0] === date.split('T')[0]
              )
            );
            return response.filter((absence) => {
              return absence.Timestamp.split('T')[0] === date.split('T')[0];
            });
          } else {
            return [];
          }
        })
      );
  }

  // between 2 dates - for my own purpose
  searchAbsences(startDate: string, endDate: string): Observable<Absence[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.apiService
      .get<Absence[] | AbsenceApiResponse>('Absences', params)
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response.filter((absence) => {
              absence.Timestamp.split('T')[0] >= startDate.split('T')[0] &&
                absence.Timestamp.split('T')[0] <= endDate.split('T')[0];
            });
          } else {
            return [];
          }
        })
      );
  }
}
