import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const AUTH_KEY = 'auth_credentials';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store auth data correctly', () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    service.saveAuthCredentials(clientId, clientSecret);
    const authData = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    expect(authData.clientId).toBe(clientId);
    expect(authData.clientSecret).toBe(clientSecret);
  });

  it('should get auth data correctly', () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    service.saveAuthCredentials(clientId, clientSecret);
    const authData = service.getAuthCredentials();
    expect(authData?.clientId).toBe(clientId);
    expect(authData?.clientSecret).toBe(clientSecret);
  });

  it('should clear auth data correctly', () => {
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    service.saveAuthCredentials(clientId, clientSecret);
    service.clearAuthCredentials();
    const authData = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    expect(authData.clientId).toBeUndefined();
    expect(authData.clientSecret).toBeUndefined();
  });

  it('should store token correctly', () => {
    const token = 'auth_token';
    service.saveToken(token);
    expect(localStorage.getItem('auth_token')).toBe(token);
  });

  it('should get token correctly', () => {
    const token = 'auth_token';
    service.saveToken(token);
    expect(service.getToken()).toBe(token);
  });

  it('should clear token correctly', () => {
    const token = 'auth_token';
    service.saveToken(token);
    service.clearToken();
    expect(localStorage.getItem('auth_token')).toBeNull();
  }
  );

});
