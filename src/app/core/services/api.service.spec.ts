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

  it('should make POST request with correct body', () => {
    const expectedData = { id: '101', name: 'Created User' };
    const endpoint = 'Users';
    const requestBody = { name: 'Created User' };

    let actualData: any = null;
    service.post(endpoint, requestBody).subscribe((data) => {
      actualData = data;
    });

    const req = httpController.expectOne(`${baseUrl}/${endpoint}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestBody);
    req.flush(expectedData);
    expect(actualData).toEqual(expectedData);
  });

  it('should make PUT request with correct body', () => {
    const expectedData = { id: '1', name: 'Updated User' };
    const endpoint = 'Users/1';
    const requestBody = { name: 'Updated User' };

    let actualData: any = null;
    service.put(endpoint, requestBody).subscribe((data) => {
      actualData = data;
    });

    const req = httpController.expectOne(`${baseUrl}/${endpoint}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestBody);
    req.flush(expectedData);
    expect(actualData).toEqual(expectedData);
  });

  it('should make DELETE request', () => {
    const endpoint = 'Users/1';

    let completed = false;
    service.delete(endpoint).subscribe(() => {
      completed = true;
    });

    const req = httpController.expectOne(`${baseUrl}/${endpoint}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(completed).toBeTrue();
  });

  it('should handle 401 unauthorized errors', () => {
    const endpoint = 'Users';

    let errorMessage = '';
    service.get(endpoint).subscribe({
      next: () => fail('Should have failed with an error'),
      error: (error) => {
        errorMessage = error.message;
      },
    });

    const req = httpController.expectOne(`${baseUrl}/${endpoint}`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized'});
    expect(errorMessage).toBe('Authentication error. Please log in again.');
  });
});
