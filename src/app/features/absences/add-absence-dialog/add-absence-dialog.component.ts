import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AbsenceService } from '../../../core/services/absence.service';
import {
  AbsenceDefinition,
  NewAbsenceRequest,
} from '../../../core/models/absence.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-add-absence-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-absence-dialog.component.html',
  styleUrls: ['./add-absence-dialog.component.css'],
})
export class AddAbsenceDialogComponent implements OnInit {
 
  // properties that receive data from parent
  @Input() user!: User;
  @Input() show = false;

  // events that notify parent
  @Output() close = new EventEmitter<void>();
  @Output() absenceAdded = new EventEmitter<void>();

  absenceForm!: FormGroup;
  absenceDefinitions: AbsenceDefinition[] = [];
  loading = false;
  submitting = false;
  errorMessage = '';
  isPartialTimeSelected = false;

  constructor(
    private formBuilder: FormBuilder,
    private absenceService: AbsenceService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAbsenceDefinitions();

    this.absenceForm.get('IsPartial')?.valueChanges.subscribe(isPartial => {
      this.isPartialTimeSelected = isPartial;
      
      if (isPartial) {
        this.absenceForm.get('PartialTimeFrom')?.setValidators([Validators.required]);
        this.absenceForm.get('PartialTimeTo')?.setValidators([Validators.required]);
      } else {
        this.absenceForm.get('PartialTimeFrom')?.clearValidators();
        this.absenceForm.get('PartialTimeTo')?.clearValidators();
        this.absenceForm.get('PartialTimeFrom')?.setValue(null);
        this.absenceForm.get('PartialTimeTo')?.setValue(null);
      }
      
      this.absenceForm.get('PartialTimeFrom')?.updateValueAndValidity();
      this.absenceForm.get('PartialTimeTo')?.updateValueAndValidity();
    });
  }

  initForm(): void {
    // get today in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    this.absenceForm = this.formBuilder.group(
      {
        AbsenceDefinitionId: ['', Validators.required],
        Timestamp: [today, Validators.required],
        Comment: [''],
        IsPartial: [false],
        PartialTimeFrom: [null],
        PartialTimeTo: [null],
      },
      {
        validators: this.validateTimeRange,
      }
    );
  }

  loadAbsenceDefinitions(): void {
    this.loading = true;
    
    this.absenceService.getAllAbsenceDefinitions().subscribe({
      next: (definitions) => {
        this.absenceDefinitions = definitions.filter((d) => d.IsActive);
        this.loading = false;
        
        // first definition as default
        if (this.absenceDefinitions.length > 0) {
          this.absenceForm
            .get('AbsenceDefinitionId')
            ?.setValue(this.absenceDefinitions[0].Id);
        }
      },
      error: (error) => {
        this.errorMessage = `Failed to load absence types: ${error.message}`;
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.absenceForm.invalid || this.submitting) {
      return;
    }
    
    this.submitting = true;
    this.errorMessage = '';

    // timestamp to include time component
    let timestamp = this.absenceForm.value.Timestamp;
    if (!timestamp.includes('T')) {
      timestamp = `${timestamp}T00:00:00Z`;
    }
    
    const absenceRequest: NewAbsenceRequest = {
      UserId: this.user.Id,
      Timestamp: timestamp,
      AbsenceDefinitionId: this.absenceForm.value.AbsenceDefinitionId,
      Comment: this.absenceForm.value.Comment,
      IsPartial: this.absenceForm.value.IsPartial,
    };
    
    // if partial absence - add time range 
    if (this.absenceForm.value.IsPartial) {
      const dateStr = this.absenceForm.value.Timestamp;
      const fromTime = this.absenceForm.value.PartialTimeFrom;
      const toTime = this.absenceForm.value.PartialTimeTo;
      
      absenceRequest.PartialTimeFrom = `${dateStr}T${fromTime}:00Z`;
      absenceRequest.PartialTimeTo = `${dateStr}T${toTime}:00Z`;
    }
    
    this.absenceService.createAbsence(absenceRequest).subscribe({
      next: () => {
        this.submitting = false;
        this.absenceAdded.emit();
        this.closeDialog();
      },
      error: (error) => {
        this.errorMessage = `Error adding absence: ${error.message}`;
        this.submitting = false;
      }
    });
  }

  private validateTimeRange(group: AbstractControl): ValidationErrors | null {
    if (!group.get('IsPartial')?.value) {
      return null; 
    }
    
    const fromTime = group.get('PartialTimeFrom')?.value;
    const toTime = group.get('PartialTimeTo')?.value;
    if (!fromTime || !toTime) {
      return null;
    }
    if (fromTime >= toTime) {
      return { invalidTimeRange: true };
    }
    return null;
  }

  hasTimeRangeError(): boolean {
    return (
      this.absenceForm.hasError('invalidTimeRange') &&
      this.absenceForm.get('IsPartial')?.value &&
      this.absenceForm.get('PartialTimeFrom')?.value &&
      this.absenceForm.get('PartialTimeTo')?.value
    );
  }

  closeDialog(): void {
    this.absenceForm.reset();
    this.initForm(); // re-initialize form with default values
    this.close.emit();
  }
}