import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceGridComponent } from './absence-grid.component';

describe('AbsenceGridComponent', () => {
  let component: AbsenceGridComponent;
  let fixture: ComponentFixture<AbsenceGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsenceGridComponent]
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
