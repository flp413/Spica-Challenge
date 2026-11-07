import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { UserGridComponent } from './user-grid.component';

describe('UserGridComponent', () => {
  let component: UserGridComponent;
  let fixture: ComponentFixture<UserGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGridComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
