import { TestBed } from '@angular/core/testing';

import { PeopleManageService } from './people-manage.service';

describe('PeopleManageService', () => {
  let service: PeopleManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
