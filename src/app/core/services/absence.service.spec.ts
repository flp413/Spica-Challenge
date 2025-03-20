import { TestBed } from '@angular/core/testing';
import { AbsenceService } from './absence.service';
import { ApiService } from './api.service';
import { AbsenceDefinition } from '../models/absence.model';
import { of } from 'rxjs';

describe('AbsenceService', () => {
  let service: AbsenceService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockDefinition: AbsenceDefinition[] =  [
    { Id: '1', Name: 'Annual leave', Type: 0, IsActive: true },
    { Id: '2', Name: 'Maternity leave', Type: 0, IsActive: true },
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        AbsenceService,
        { provide: ApiService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(AbsenceService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all absence definitions', () => {
    apiServiceSpy.get.and.returnValue(of(mockDefinition));

    service.getAllAbsenceDefinitions().subscribe(definitions => {
      expect(definitions).toEqual(mockDefinition);
      expect(apiServiceSpy.get).toHaveBeenCalledWith('AbsenceDefinitions');
    });
  });
});
