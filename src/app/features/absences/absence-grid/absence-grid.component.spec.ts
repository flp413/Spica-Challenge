import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AbsenceGridComponent } from './absence-grid.component';

describe('AbsenceGridComponent', () => {
  let component: AbsenceGridComponent;
  let fixture: ComponentFixture<AbsenceGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsenceGridComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
