import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockAuthService {
  getToken(): Observable<string> {
    return of('mock-token-123');
  }
}

describe('ApiService', () => {
  let service: ApiService;
  let httpController: HttpTestingController;
  
  const baseUrl = 'https://api4.allhours.com/api/v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // HttpClientTestingModule is deprecated!
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        
        ApiService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });
    
    service = TestBed.inject(ApiService);
    httpController = TestBed.inject(HttpTestingController);
    
    spyOn(console, 'error');
  });

  // verify no outstanding requests (after each test)
  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request with auth header', () => {
    // what we expect to receive
    const expectedData = { id: '1', name: 'Test User' };
    const endpoint = 'Users';
    
    // HTTP request
    let actualData: any = null;
    service.get(endpoint).subscribe(data => {
      actualData = data;
    });
    
    // intercepts the request
    const req = httpController.expectOne(`${baseUrl}/${endpoint}`);
    // check if request was made correctly
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token-123');
    // simulates server's successful response with expected data
    req.flush(expectedData);
    // result
    expect(actualData).toEqual(expectedData);
  });

  it('should make GET request with query parameters', () => {
    const expectedData = [{ id: '1', name: 'Test User' }];
    const endpoint = 'Users';
    const params = new HttpParams().set('search', 'test');
    
    let actualData: any = null;
    service.get(endpoint, params).subscribe(data => {
      actualData = data;
    });
    
    const req = httpController.expectOne(`${baseUrl}/${endpoint}?search=test`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search')).toBe('test');
    req.flush(expectedData);
    expect(actualData).toEqual(expectedData);
  });
});