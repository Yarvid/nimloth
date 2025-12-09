import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PersonService } from '../person.service';
import { PersonCardComponent } from '../person-card/person-card.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { FamilyTreeGraphComponent } from '../family-tree-graph/family-tree-graph.component';
import { ViewStateService, ViewMode } from '../view-state.service';
import { IPerson } from '../models';

@Component({
  selector: 'app-tree-visualization',
  templateUrl: './tree-visualization.component.html',
  styleUrls: ['./tree-visualization.component.scss'],
  imports: [
    PersonCardComponent,
    FamilyTreeGraphComponent,
    NgIf,
    NgFor,
    MatDialogModule,
  ],
  standalone: true,
})
export class TreeVisualizationComponent implements OnInit, OnDestroy {
  persons: IPerson[] = [];
  loading = false;
  error: string | null = null;
  currentViewMode: ViewMode = 'grid';
  private personCreatedSubscription?: Subscription;
  private viewModeSubscription?: Subscription;

  constructor(
    private personService: PersonService,
    private viewStateService: ViewStateService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadPersons();

    this.personCreatedSubscription =
      this.personService.personCreated$.subscribe(() => {
        this.loadPersons();
      });

    this.viewModeSubscription = this.viewStateService.viewMode$.subscribe(
      (mode) => {
        this.currentViewMode = mode;
      },
    );
  }

  ngOnDestroy(): void {
    if (this.personCreatedSubscription) {
      this.personCreatedSubscription.unsubscribe();
    }
    if (this.viewModeSubscription) {
      this.viewModeSubscription.unsubscribe();
    }
  }

  loadPersons(): void {
    this.loading = true;
    this.error = null;
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

  openEditModal(person: IPerson): void {
    this.dialog.open(EditModalComponent, {
      width: '800px',
      data: { person },
    });
  }
}
