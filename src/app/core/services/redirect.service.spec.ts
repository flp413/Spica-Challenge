import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { RedirectService } from './redirect.service';
import { AuthService } from './auth.service';

describe('RedirectService', () => {
  let service: RedirectService;
  let mockRouter: any;
  let mockAuthService: any;
  let tokenValue: BehaviorSubject<string | null>;

  beforeEach(() => {
    mockRouter = {
      navigate: function(path: string[]) {
        this.navigatedTo = path;
      },
      navigatedTo: null
    };

    tokenValue = new BehaviorSubject<string | null>(null);
    mockAuthService = {
      tokenSubject: tokenValue
    };

    TestBed.configureTestingModule({
      providers: [
        RedirectService,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    
    service = TestBed.inject(RedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if authenticated', () => {
    tokenValue.next('mock-token');
    expect(service.checkAuthAndRedirect()).toBeTrue();
  });

  it ('should return false if not authenticated and redirect to settings', () => {
    tokenValue.next(null);
    expect(service.checkAuthAndRedirect()).toBeFalse();
    expect(mockRouter.navigatedTo).toEqual(['/settings']);
  }); 
});
