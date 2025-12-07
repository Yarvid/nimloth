import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonCardComponent } from './person-card.component';
import { IPerson } from '../models';

describe('PersonCardComponent', () => {
  let component: PersonCardComponent;
  let fixture: ComponentFixture<PersonCardComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonCardComponent);
    component = fixture.componentInstance;
    component.person = mockPerson;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
