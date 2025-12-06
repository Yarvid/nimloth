import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPerson } from '../models';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss'],
})
export class PersonCardComponent {
  @Input() person!: IPerson;
  @Output() editPerson = new EventEmitter<IPerson>();

  onEdit(): void {
    this.editPerson.emit(this.person);
  }
}
