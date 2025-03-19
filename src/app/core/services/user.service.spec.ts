import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { User, NewUserRequest } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let apiServiceMock: any;

  const mockUsers: User[] = [
    { Id: '1', FirstName: 'Nina', LastName: 'Hrovat', Email: 'nina@example.com' } as User,
    { Id: '2', FirstName: 'Izak', LastName: 'De Reggi', Email: 'izak@gmail.com' } as User
  ];
  
  beforeEach(() => {
    apiServiceMock = {
      get: jasmine.createSpy('get').and.returnValue(of(mockUsers)),
      post: jasmine.createSpy('post').and.returnValue(of(mockUsers[0]))
    };
    
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });
    
    service = TestBed.inject(UserService);
    spyOn(console, 'log').and.callThrough();
    spyOn(console, 'warn').and.callThrough();
  });

  it('should retrieve all users when they come as an array', (done) => {
    apiServiceMock.get.and.returnValue(of(mockUsers));
    
    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(apiServiceMock.get).toHaveBeenCalledWith('Users');
      done();
    });
  });

  it('should handle empty search results', (done) => {
    apiServiceMock.get.and.returnValue(of([]));
    
    service.searchUsers('NonExistent').subscribe(users => {
      expect(users).toEqual([]);
      expect(apiServiceMock.get).toHaveBeenCalled();
      done();
    });
  });

  it('should filter users by search term', (done) => {
    apiServiceMock.get.and.returnValue(of(mockUsers));
    
    service.searchUsers('Nina').subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].FirstName).toBe('Nina');
      done();
    });
  });

  it('should get a user by ID', (done) => {
    const singleUser = mockUsers[0];
    apiServiceMock.get.and.returnValue(of(singleUser));
    
    service.getUserById('1').subscribe(user => {
      expect(user).toEqual(singleUser);
      expect(apiServiceMock.get).toHaveBeenCalledWith('Users/1');
      done();
    });
  });

});