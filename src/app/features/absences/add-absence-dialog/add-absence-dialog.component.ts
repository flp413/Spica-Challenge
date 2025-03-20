import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AbsenceService } from '../../../core/services/absence.service';
import { AbsenceDefinition, NewAbsenceRequest } from '../../../core/models/absence.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-add-absence-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-absence-dialog.component.html',
  styleUrls: ['./add-absence-dialog.component.css']
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
    
    this.absenceForm = this.formBuilder.group({
      AbsenceDefinitionId: ['', Validators.required],
      Timestamp: [today, Validators.required],
      Comment: [''],
      IsPartial: [false],
      PartialTimeFrom: [null],
      PartialTimeTo: [null]
    });
  }

  loadAbsenceDefinitions(): void {
    this.loading = true;
    
    this.absenceService.getAllAbsenceDefinitions().subscribe({
      next: (definitions) => {
        this.absenceDefinitions = definitions.filter(d => d.IsActive);
        this.loading = false;
        
        // first definition as default
        if (this.absenceDefinitions.length > 0) {
          this.absenceForm.get('AbsenceDefinitionId')?.setValue(this.absenceDefinitions[0].Id);
        }
      },
      error: (error) => {
        this.errorMessage = `Failed to load absence types: ${error.message}`;
        this.loading = false;
      }
    });
  }
}