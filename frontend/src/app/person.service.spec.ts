import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IPerson } from './models';
import { PersonService } from './person.service';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8000/api/person/';

  const mockPerson: IPerson = {
    id: 1,
    first_name: 'John',
    middle_name: 'Doe',
    last_name: 'Smith',
    birth_name: '',
    artist_name: '',
    date_of_birth: '1990-01-01',
    place_of_birth: 'New York',
    date_of_death: null,
    place_of_death: '',
    cause_of_death: '',
    mother: null,
    father: null,
    gender: 'M',
  };

  const mockPersons: IPerson[] = [
    mockPerson,
    {
      id: 2,
      first_name: 'Jane',
      middle_name: '',
      last_name: 'Doe',
      birth_name: '',
      artist_name: '',
      date_of_birth: '1992-05-15',
      place_of_birth: 'Los Angeles',
      date_of_death: null,
      place_of_death: '',
      cause_of_death: '',
      mother: null,
      father: null,
      gender: 'F',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PersonService],
    });
    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPersons', () => {
    it('should retrieve all persons from the API', () => {
      service.getAllPersons().subscribe((persons) => {
        expect(persons).toEqual(mockPersons);
        expect(persons.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPersons);
    });

    it('should return an empty array when no persons exist', () => {
      service.getAllPersons().subscribe((persons) => {
        expect(persons).toEqual([]);
        expect(persons.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('createPerson', () => {
    it('should create a new person via POST request', () => {
      const newPerson: IPerson = {
        first_name: 'Alice',
        middle_name: '',
        last_name: 'Johnson',
        birth_name: '',
        artist_name: '',
        date_of_birth: null,
        place_of_birth: '',
        date_of_death: null,
        place_of_death: '',
        cause_of_death: '',
        mother: null,
        father: null,
        gender: 'F',
      };

      const createdPerson: IPerson = { ...newPerson, id: 3 };

      service.createPerson(newPerson).subscribe((person) => {
        expect(person).toEqual(createdPerson);
        expect(person.id).toBe(3);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPerson);
      req.flush(createdPerson);
    });

    it('should emit created person through personCreated$ observable', (done) => {
      const newPerson: IPerson = {
        first_name: 'Bob',
        middle_name: '',
        last_name: 'Brown',
        birth_name: '',
        artist_name: '',
        date_of_birth: null,
        place_of_birth: '',
        date_of_death: null,
        place_of_death: '',
        cause_of_death: '',
        mother: null,
        father: null,
        gender: 'M',
      };

      const createdPerson: IPerson = { ...newPerson, id: 4 };

      service.personCreated$.subscribe((person) => {
        expect(person).toEqual(createdPerson);
        done();
      });

      service.createPerson(newPerson).subscribe();

      const req = httpMock.expectOne(apiUrl);
      req.flush(createdPerson);
    });
  });

  describe('updatePerson', () => {
    it('should update an existing person via PUT request', () => {
      const updatedPerson: IPerson = {
        ...mockPerson,
        first_name: 'Updated',
      };

      service.updatePerson(1, updatedPerson).subscribe((person) => {
        expect(person).toEqual(updatedPerson);
        expect(person.first_name).toBe('Updated');
      });

      const req = httpMock.expectOne(`${apiUrl}1/`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPerson);
      req.flush(updatedPerson);
    });

    it('should emit updated person through personCreated$ observable', (done) => {
      const updatedPerson: IPerson = {
        ...mockPerson,
        last_name: 'UpdatedName',
      };

      service.personCreated$.subscribe((person) => {
        expect(person).toEqual(updatedPerson);
        done();
      });

      service.updatePerson(1, updatedPerson).subscribe();

      const req = httpMock.expectOne(`${apiUrl}1/`);
      req.flush(updatedPerson);
    });
  });

  describe('deletePerson', () => {
    it('should delete a person via DELETE request', () => {
      service.deletePerson(1).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}1/`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should emit empty person through personCreated$ observable on delete', (done) => {
      service.personCreated$.subscribe((person) => {
        expect(person).toEqual({} as IPerson);
        done();
      });

      service.deletePerson(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}1/`);
      req.flush(null);
    });
  });

  describe('error handling', () => {
    it('should handle error when getAllPersons fails', () => {
      service.getAllPersons().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should handle error when createPerson fails', () => {
      service.createPerson(mockPerson).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });
});
