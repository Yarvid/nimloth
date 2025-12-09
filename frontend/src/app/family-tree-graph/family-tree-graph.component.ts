import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import cytoscape, { Core, NodeSingular, EdgeSingular } from 'cytoscape';
import { PersonService } from '../person.service';
import { IPerson } from '../models/person.interface';
import {
  CreateModalComponent,
  CreatePersonData,
} from '../create-modal/create-modal.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { Subscription } from 'rxjs';

interface GraphNode {
  data: {
    id: string;
    person: IPerson;
    label: string;
  };
}

interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    type: 'mother' | 'father';
  };
}

@Component({
  selector: 'app-family-tree-graph',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './family-tree-graph.component.html',
  styleUrl: './family-tree-graph.component.scss',
})
export class FamilyTreeGraphComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('cyContainer', { static: false }) cyContainer!: ElementRef;

  private cy!: Core;
  private persons: IPerson[] = [];
  private currentUserPerson: IPerson | null = null;
  private personCreatedSubscription?: Subscription;

  loading = true;
  error: string | null = null;
  selectedPerson: IPerson | null = null;
  contextMenuPosition = { x: 0, y: 0 };
  showContextMenu = false;

  constructor(
    private personService: PersonService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Subscribe to person creation events to refresh the graph
    this.personCreatedSubscription =
      this.personService.personCreated$.subscribe(() => {
        this.loadData();
      });
  }

  ngAfterViewInit(): void {
    // Cytoscape will be initialized after data is loaded
  }

  ngOnDestroy(): void {
    if (this.cy) {
      this.cy.destroy();
    }
    if (this.personCreatedSubscription) {
      this.personCreatedSubscription.unsubscribe();
    }
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    // Load all persons and current user's person
    this.personService.getAllPersons().subscribe({
      next: (persons) => {
        this.persons = persons;
        this.loadCurrentUserPerson();
      },
      error: (err) => {
        this.error = 'Failed to load persons: ' + err;
        this.loading = false;
      },
    });
  }

  private loadCurrentUserPerson(): void {
    this.personService.getCurrentUserPerson().subscribe({
      next: (userPerson) => {
        this.currentUserPerson = userPerson;
        this.initializeGraph();
        this.loading = false;
      },
      error: (err) => {
        console.warn('Could not load current user person:', err);
        // Still initialize graph with all persons if user person fails
        this.initializeGraph();
        this.loading = false;
      },
    });
  }

  private initializeGraph(): void {
    if (!this.cyContainer) {
      setTimeout(() => this.initializeGraph(), 100);
      return;
    }

    const { nodes, edges } = this.buildGraphData();

    this.cy = cytoscape({
      container: this.cyContainer.nativeElement,
      elements: {
        nodes,
        edges,
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#667eea',
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            color: '#fff',
            'font-size': '12px',
            'font-weight': 'bold',
            width: 120,
            height: 80,
            shape: 'roundrectangle',
            'border-width': 2,
            'border-color': '#5568d3',
            'text-wrap': 'wrap',
            'text-max-width': '110px',
          },
        },
        {
          selector: 'node.current-user',
          style: {
            'border-color': '#764ba2',
            'border-width': 4,
            'background-color': '#764ba2',
          },
        },
        {
          selector: 'node.marriage-node',
          style: {
            width: 8,
            height: 8,
            'background-color': '#999',
            'border-width': 0,
            label: '',
            shape: 'ellipse',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'preset',
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: true,
    });

    // Add click event to show person details (only for person nodes, not marriage nodes)
    this.cy.on('tap', 'node', (event) => {
      const node = event.target as NodeSingular;
      const person = node.data('person') as IPerson;
      // Only open modal if this is a real person node
      if (person && person.id) {
        this.openEditModal(person);
      }
    });

    // Add context menu for adding relatives (only for person nodes)
    this.cy.on('cxttap', 'node', (event) => {
      const node = event.target as NodeSingular;
      const person = node.data('person') as IPerson;
      // Only show menu if this is a real person node
      if (person && person.id) {
        this.showAddRelativeMenu(person, event);
      }
    });
  }

  private buildGraphData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Get family members related to current user
    const familyMembers = this.getFamilyMembers();

    // Calculate generations for each person
    const generations = this.calculateGenerations(familyMembers);

    // Track children with both parents for edge merging
    const childrenWithBothParents = new Map<number, { mother: number; father: number }>();

    familyMembers.forEach((person) => {
      if (person.id && person.mother && person.father) {
        childrenWithBothParents.set(person.id, {
          mother: person.mother,
          father: person.father,
        });
      }
    });

    // Calculate positions for each person based on generation
    const positions = this.calculatePositions(familyMembers, generations);

    // Build nodes for each family member
    familyMembers.forEach((person) => {
      const label = this.getPersonLabel(person);
      const classes: string[] = [];

      // Mark current user
      if (
        this.currentUserPerson &&
        person.id === this.currentUserPerson.id
      ) {
        classes.push('current-user');
      }

      const position = positions.get(person.id!);

      nodes.push({
        data: {
          id: `person-${person.id}`,
          person: person,
          label: label,
        },
        position: position,
        classes: classes.join(' '),
      } as any);
    });

    // Create edges with merging logic for children with both parents
    familyMembers.forEach((person) => {
      if (!person.id) return;

      const hasBothParents = person.mother && person.father;

      if (hasBothParents) {
        // Create a virtual marriage node
        const marriageNodeId = `marriage-${person.mother}-${person.father}`;

        // Check if marriage node already exists
        if (!nodes.find((n: any) => n.data.id === marriageNodeId)) {
          // Calculate marriage node position (between the two parents)
          const motherPos = positions.get(person.mother!);
          const fatherPos = positions.get(person.father!);
          const marriagePos = motherPos && fatherPos
            ? { x: (motherPos.x + fatherPos.x) / 2, y: (motherPos.y + fatherPos.y) / 2 }
            : undefined;

          nodes.push({
            data: {
              id: marriageNodeId,
              label: '',
            },
            position: marriagePos,
            classes: 'marriage-node',
          } as any);

          // Edge from mother to marriage node
          edges.push({
            data: {
              id: `edge-mother-${person.mother}-to-marriage-${marriageNodeId}`,
              source: `person-${person.mother}`,
              target: marriageNodeId,
              type: 'mother',
            },
          });

          // Edge from father to marriage node
          edges.push({
            data: {
              id: `edge-father-${person.father}-to-marriage-${marriageNodeId}`,
              source: `person-${person.father}`,
              target: marriageNodeId,
              type: 'father',
            },
          });
        }

        // Edge from marriage node to child
        edges.push({
          data: {
            id: `edge-marriage-${marriageNodeId}-to-child-${person.id}`,
            source: marriageNodeId,
            target: `person-${person.id}`,
            type: 'mother',
          },
        });
      } else {
        // Single parent edges (original behavior)
        if (person.mother) {
          edges.push({
            data: {
              id: `edge-${person.id}-mother-${person.mother}`,
              source: `person-${person.mother}`,
              target: `person-${person.id}`,
              type: 'mother',
            },
          });
        }

        if (person.father) {
          edges.push({
            data: {
              id: `edge-${person.id}-father-${person.father}`,
              source: `person-${person.father}`,
              target: `person-${person.id}`,
              type: 'father',
            },
          });
        }
      }
    });

    return { nodes, edges };
  }

  private getFamilyMembers(): IPerson[] {
    if (!this.currentUserPerson) {
      // If no current user, show all persons
      return this.persons;
    }

    const familySet = new Set<number>();
    const toProcess: number[] = [this.currentUserPerson.id!];

    // Traverse up and down the family tree
    while (toProcess.length > 0) {
      const currentId = toProcess.pop()!;

      if (familySet.has(currentId)) {
        continue;
      }

      familySet.add(currentId);
      const person = this.persons.find((p) => p.id === currentId);

      if (!person) {
        continue;
      }

      // Add parents
      if (person.mother && !familySet.has(person.mother)) {
        toProcess.push(person.mother);
      }
      if (person.father && !familySet.has(person.father)) {
        toProcess.push(person.father);
      }

      // Add children (find persons who have this person as parent)
      this.persons.forEach((p) => {
        if (
          p.id &&
          !familySet.has(p.id) &&
          (p.mother === currentId || p.father === currentId)
        ) {
          toProcess.push(p.id);
        }
      });
    }

    return this.persons.filter((p) => p.id && familySet.has(p.id));
  }

  private getPersonLabel(person: IPerson): string {
    const nameParts: string[] = [];

    if (person.first_name) nameParts.push(person.first_name);
    if (person.middle_name) nameParts.push(person.middle_name);
    if (person.last_name) nameParts.push(person.last_name);

    let label = nameParts.join(' ') || 'Unknown';

    // Add birth/death years if available
    const birthYear = person.date_of_birth
      ? new Date(person.date_of_birth).getFullYear()
      : null;
    const deathYear = person.date_of_death
      ? new Date(person.date_of_death).getFullYear()
      : null;

    if (birthYear || deathYear) {
      label += `\n(${birthYear || '?'} - ${deathYear || ''})`;
    }

    return label;
  }

  private calculateGenerations(familyMembers: IPerson[]): Map<number, number> {
    const generations = new Map<number, number>();

    if (!this.currentUserPerson || !this.currentUserPerson.id) {
      // If no current user, assign generation 0 to all
      familyMembers.forEach(p => {
        if (p.id) generations.set(p.id, 0);
      });
      return generations;
    }

    // Current user is generation 0
    generations.set(this.currentUserPerson.id, 0);

    // BFS to assign generations
    const queue: { id: number; generation: number }[] = [
      { id: this.currentUserPerson.id, generation: 0 }
    ];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const { id, generation } = queue.shift()!;

      if (visited.has(id)) continue;
      visited.add(id);

      const person = familyMembers.find(p => p.id === id);
      if (!person) continue;

      // Parents are one generation up (positive)
      if (person.mother && !visited.has(person.mother)) {
        generations.set(person.mother, generation + 1);
        queue.push({ id: person.mother, generation: generation + 1 });
      }
      if (person.father && !visited.has(person.father)) {
        generations.set(person.father, generation + 1);
        queue.push({ id: person.father, generation: generation + 1 });
      }

      // Children are one generation down (negative)
      familyMembers.forEach(p => {
        if (p.id && !visited.has(p.id) && (p.mother === id || p.father === id)) {
          generations.set(p.id, generation - 1);
          queue.push({ id: p.id, generation: generation - 1 });
        }
      });
    }

    return generations;
  }

  private calculatePositions(
    familyMembers: IPerson[],
    generations: Map<number, number>
  ): Map<number, { x: number; y: number }> {
    const positions = new Map<number, { x: number; y: number }>();

    // Group people by generation
    const generationGroups = new Map<number, IPerson[]>();
    familyMembers.forEach(person => {
      if (!person.id) return;
      const gen = generations.get(person.id) || 0;
      if (!generationGroups.has(gen)) {
        generationGroups.set(gen, []);
      }
      generationGroups.get(gen)!.push(person);
    });

    // Layout parameters
    const horizontalSpacing = 200;
    const verticalSpacing = 150;

    // Position each generation
    generationGroups.forEach((people, gen) => {
      const numPeople = people.length;
      const totalWidth = (numPeople - 1) * horizontalSpacing;
      const startX = -totalWidth / 2;

      // Generation 0 (current user) is at y=0
      // Positive generations (parents) go up (negative y)
      // Negative generations (children) go down (positive y)
      const y = -gen * verticalSpacing;

      people.forEach((person, index) => {
        if (person.id) {
          positions.set(person.id, {
            x: startX + index * horizontalSpacing,
            y: y
          });
        }
      });
    });

    return positions;
  }

  private openEditModal(person: IPerson): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: { person },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData(); // Refresh graph after edit
      }
    });
  }

  private showAddRelativeMenu(person: IPerson, event: any): void {
    this.selectedPerson = person;
    const position = event.position || event.renderedPosition;
    this.contextMenuPosition = {
      x: position.x,
      y: position.y,
    };
    this.showContextMenu = true;

    // Hide context menu on next click
    setTimeout(() => {
      const hideMenu = () => {
        this.showContextMenu = false;
        document.removeEventListener('click', hideMenu);
      };
      document.addEventListener('click', hideMenu);
    }, 0);
  }

  addMother(): void {
    if (!this.selectedPerson || !this.selectedPerson.id) return;

    const data: CreatePersonData = {
      relationshipType: 'mother',
      relatedPersonId: this.selectedPerson.id,
    };

    // The new person will be the mother, so we need to update the selected person
    // after creation to set their mother field
    const dialogRef = this.dialog.open(CreateModalComponent, {
      data: data,
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((createdPerson: IPerson) => {
      if (createdPerson && this.selectedPerson) {
        // Update the child to have this new person as mother
        this.updatePersonParent(
          this.selectedPerson.id!,
          createdPerson.id!,
          'mother',
        );
      }
    });
    this.showContextMenu = false;
  }

  addFather(): void {
    if (!this.selectedPerson || !this.selectedPerson.id) return;

    const data: CreatePersonData = {
      relationshipType: 'father',
      relatedPersonId: this.selectedPerson.id,
    };

    const dialogRef = this.dialog.open(CreateModalComponent, {
      data: data,
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((createdPerson: IPerson) => {
      if (createdPerson && this.selectedPerson) {
        // Update the child to have this new person as father
        this.updatePersonParent(
          this.selectedPerson.id!,
          createdPerson.id!,
          'father',
        );
      }
    });
    this.showContextMenu = false;
  }

  addChild(): void {
    if (!this.selectedPerson || !this.selectedPerson.id) return;

    // Determine parent field based on selected person's gender
    const data: CreatePersonData = {};
    if (this.selectedPerson.gender === 'F') {
      data.mother = this.selectedPerson.id;
    } else if (this.selectedPerson.gender === 'M') {
      data.father = this.selectedPerson.id;
    } else {
      // For non-binary or unspecified, let user choose
      data.mother = this.selectedPerson.id;
    }

    const dialogRef = this.dialog.open(CreateModalComponent, {
      data: data,
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result: IPerson) => {
      if (result) {
        this.loadData(); // Refresh graph
      }
    });
    this.showContextMenu = false;
  }

  private updatePersonParent(
    childId: number,
    parentId: number,
    parentType: 'mother' | 'father',
  ): void {
    const child = this.persons.find((p) => p.id === childId);
    if (!child) return;

    const updatedChild: IPerson = {
      ...child,
      [parentType]: parentId,
    };

    this.personService.updatePerson(childId, updatedChild).subscribe({
      next: () => {
        this.loadData(); // Refresh graph
      },
      error: (err) => {
        console.error('Failed to update parent relationship:', err);
        alert('Failed to update parent relationship');
      },
    });
  }
}
