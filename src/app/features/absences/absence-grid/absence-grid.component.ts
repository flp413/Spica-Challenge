import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbsenceService } from '../../../core/services/absence.service';
import { UserService } from '../../../core/services/user.service';
import { RedirectService } from '../../../core/services/redirect.service';
import { Absence } from '../../../core/models/absence.model';
import { User } from '../../../core/models/user.model';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface EmployeeAbsence {
  user: User;
  absence: Absence;
  absenceType: string;
}

@Component({
  selector: 'app-absence-grid',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './absence-grid.component.html',
  styleUrls: ['./absence-grid.component.css'],
})
export class AbsenceGridComponent implements OnInit {
  private readonly absenceService = inject(AbsenceService);
  private readonly userService = inject(UserService);
  private readonly redirectService = inject(RedirectService);

  selectedDate: string = new Date().toISOString().split('T')[0]; // today in YYYY-MM-DD format
  employeeAbsences: EmployeeAbsence[] = [];
  errorMessage = '';
  noAbsencesFound = false;

  private absenceDefinitions: { [id: string]: string } = {};

  ngOnInit(): void {
    console.log("Auth - absence", !this.redirectService.checkAuthAndRedirect());
    if (!this.redirectService.checkAuthAndRedirect()) {
      return;
    }

    this.loadAbsenceDefinitions()
      .pipe(tap(() => this.loadAbsencesForDate()))
      .subscribe();
  }

  private loadAbsenceDefinitions(): Observable<void> {
    return this.absenceService.getAllAbsenceDefinitions().pipe(
      tap((definitions) => {
        console.log(`Loaded ${definitions.length} absence definitions:`, definitions);
        definitions.forEach((def) => {
          this.absenceDefinitions[def.Id] = def.Name;
        });
      }),
      catchError((error) => {
        this.errorMessage = `Error loading absence types: ${error.message}`;
        return of(undefined);
      }),
      map(() => void 0)
    );
  }

  loadAbsencesForDate(): void {
    this.errorMessage = '';
    this.employeeAbsences = [];
    this.noAbsencesFound = false;

    // Format date for the API - ensure UTC format
    const apiDate = new Date(this.selectedDate);
    const apiDateFormat = apiDate.toISOString();

    console.log(
      `Loading absences for date: ${this.selectedDate} (API format: ${apiDateFormat})`
    );

    // first - all absences for selected date
    this.absenceService
      .getAbsencesForDate(this.selectedDate)
      .pipe(
        catchError((error) => {
          this.errorMessage = `Error loading absences: ${error.message}`;
          return of([]);
        })
      )
      .subscribe((absences) => {
        console.log(
          `Received ${absences.length} absences for ${this.selectedDate}`
        );

        if (absences.length === 0) {
          this.noAbsencesFound = true;
          return;
        }

        // second - each absences and load user 
        absences.forEach((absence) => {
          this.loadUserForAbsence(absence);
        });
      });
  }

  loadUserForAbsence(absence: any): void {
    this.userService
      .getUserById(absence.UserId)
      .pipe(
        catchError((error) => {
          console.error(`Error loading user for absence: ${error.message}`);
          return of(null);
        })
      )
      .subscribe((user) => {
        if (user) {
          console.log(
            `Loaded user ${user.FirstName} ${user.LastName}`
          );

          // absence record with user data
          const employeeAbsence = {
            user: user,
            absence: absence,
            absenceType:
              this.absenceDefinitions[absence.AbsenceDefinitionId] || 'Unknown',
          };

          this.employeeAbsences = [...this.employeeAbsences, employeeAbsence];
          console.log(
            'Employee absences array:',
            this.employeeAbsences
          );
        } else {
          console.warn(`No user found for ID: ${absence.UserId}`);
        }
      });
  }

  onDateChange(): void {
    console.log(`Date changed to: ${this.selectedDate}`);
    this.loadAbsencesForDate();
  }

  // formatted time from ISO datetime
  formatTime(isoTime: string | undefined): string {
    if (!isoTime) return '';

    try {
      const date = new Date(isoTime);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '';
    }
  }

  refreshData(): void {
    console.log('Refreshing absence data...');
    this.loadAbsencesForDate();
  }

  // debug helper - search for absences in last 30 days 
  private debugRecentAbsences(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const startDate = thirtyDaysAgo.toISOString();
    const endDate = today.toISOString();

    console.log(
      `Searching for absences between ${startDate} and ${endDate}...`
    );

    this.absenceService.searchAbsences(startDate, endDate).subscribe({
      next: (absences) => {
        console.log(`Found ${absences.length} absences between ${startDate} and ${endDate} in the last 30 days`);

        // Group absences by date for easier testing
        const absencesByDate = absences.reduce((acc, absence) => {
          const date = absence.Timestamp.split('T')[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(absence);
          return acc;
        }, {} as Record<string, Absence[]>);

        console.log('Absences grouped by date:');
        Object.entries(absencesByDate).forEach(([date, dateAbsences]) => {
          console.log(`${date}: ${dateAbsences.length} absences`);
        });
      },
      error: (error) => {
        console.error('Error searching for recent absences:', error);
      },
    });
  }
}
