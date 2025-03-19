import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  
  const storageServiceMock = {
    token: null as string | null,
    credentials: null as any,
    
    getToken() { 
      return this.token; 
    },
    
    saveToken(token: string) { 
      this.token = token; 
    },
    
    clearToken() { 
      this.token = null; 
    },
    
    getAuthCredentials() { 
      return this.credentials; 
    }
  };
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should handle missing credentials', () => {
    // no credentials in storage
    storageServiceMock.credentials = null;
    service = TestBed.inject(AuthService);
    
    // trying to get token
    let errorReceived = false;
    let errorMessage = '';
    service.getToken().subscribe({
      next: () => {},
      error: (error) => {
        errorReceived = true;
        errorMessage = error.message;
      }
    });
    
    // should get an error
    expect(errorReceived).toBe(true);
    expect(errorMessage).toBe('No authentication credentials found. Please configure your API settings.');
    
    // no HTTP request
    httpController.expectNone('https://login.allhours.com/connect/token');
  });
});