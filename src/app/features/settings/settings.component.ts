import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { AuthService } from '../../core/services/auth.service';
import { inject } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  message: { text: string; type: 'success' | 'error' } | null = null;
  isAuthenticated = false;
  testing = false;
  
  private readonly formBuilder = inject(FormBuilder);
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);
export class SettingsComponent {

}
  private readonly router = inject(Router);
  ngOnInit(): void {
    this.initForm();
    
    this.loadSavedCredentials();
    this.checkAuthentication();
  }
  
  initForm(): void {
    this.settingsForm = this.formBuilder.group({
      clientId: ['', [Validators.required]],
      clientSecret: ['', [Validators.required]]
    });
  }
  
  loadSavedCredentials(): void {
    const credentials = this.storageService.getAuthCredentials();
    if (credentials) {
      this.settingsForm.setValue({
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret
      });
    }
  }
  
  checkAuthentication(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }
  
  onSubmit(): void {
    if (this.settingsForm.invalid)
      return;
    
    this.testing = true;
    this.message = null;
    
    const { clientId, clientSecret } = this.settingsForm.value;
    this.storageService.saveAuthCredentials(clientId, clientSecret);
    
    this.authService.logout(); 
    
    // attempt to authenticate with new credentials
    this.authService.getToken().subscribe({
      next: () => {
        this.isAuthenticated = true;
        this.testing = false;
        this.showMessage('API credentials saved and verified successfully! You can use the application.', 'success');
        
        // navigate to users page after successful authentication
        setTimeout(() => this.router.navigate(['/users']), 1100);
      },
      error: (error) => {
        this.isAuthenticated = false;
        this.testing = false;
        this.showMessage('Failed to verify credentials: ' + error.message, 'error');
      }
    });
  }
  
  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToAbsences(): void {
    this.router.navigate(['/absence']);
  }
  
  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = null, 5000);
  }
}