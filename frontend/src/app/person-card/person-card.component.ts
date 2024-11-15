import { Component, Input } from '@angular/core';

interface Person {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_name: string;
  artist_name: string;
  date_of_birth: string;
  place_of_birth: string;
  profileImage: string;
}

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [],
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent {
  @Input() person!: Person; 
}
