import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.apiService.post<Absence>('Absences', absence);
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
              const day = absence.Timestamp.split('T')[0];
              return day >= startDate.split('T')[0] && day <= endDate.split('T')[0];
            });
          } else {
            return [];
          }
        })
      );
  }
}
