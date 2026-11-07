import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AddAbsenceDialogComponent } from './add-absence-dialog.component';
import { User } from '../../../core/models/user.model';

describe('AddAbsenceDialogComponent', () => {
  let component: AddAbsenceDialogComponent;
  let fixture: ComponentFixture<AddAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAbsenceDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAbsenceDialogComponent);
    component = fixture.componentInstance;
    component.user = { Id: '1', FirstName: 'Nina', LastName: 'Hrovat', Email: 'nina@example.com' } as User;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
