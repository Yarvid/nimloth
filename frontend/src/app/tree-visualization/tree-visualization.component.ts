import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PersonService } from '../person.service';
import { PersonCardComponent } from '../person-card/person-card.component';
import { IPerson } from '../models';

@Component({
  selector: 'app-tree-visualization',
  templateUrl: './tree-visualization.component.html',
  styleUrls: ['./tree-visualization.component.scss'],
  imports: [PersonCardComponent, NgIf, NgFor],
  standalone: true,
})
export class TreeVisualizationComponent implements OnInit {
  persons: IPerson[] = [];
  loading = false;
  error: string | null = null;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loading = true;
    this.personService.getAllPersons().subscribe({
      next: (data) => {
        this.persons = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }
}
