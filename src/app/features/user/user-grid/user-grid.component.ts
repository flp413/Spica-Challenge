import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { inject } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { RedirectService } from '../../../core/services/redirect.service';

@Component({
  selector: 'app-user-grid',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.css'],
})
export class UserGridComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  newUserForm!: FormGroup;

  private readonly userService = inject(UserService);
  private readonly redirectService = inject(RedirectService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
    
    // check authentication - redirect if needed
    if (!this.redirectService.checkAuthAndRedirect()) {
      return;
    }
    // search debounce
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.performSearch(searchTerm);
      });

    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  initForm(): void {
    this.newUserForm = this.formBuilder.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log(`Loaded ${users.length} users`);
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.errorMessage = `Error loading users: ${error.message}`;
        this.loading = false;
        this.changeDetector.detectChanges();
        console.error('Failed to load users', error);
      },
    });
  }

  // SEARCH
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      // if search is empty, show all users
      this.filteredUsers = this.users;
      return;
    }

    // server-side search for better results
    this.loading = true;
    this.userService.searchUsers(searchTerm).subscribe({
      next: (users) => {
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = `Error searching users: ${error.message}`;
        this.loading = false;
      },
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = this.users;
  }

  refreshData(): void {
    this.loadUsers();
  }
}