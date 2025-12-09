import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTreeGraphComponent } from './family-tree-graph.component';

describe('FamilyTreeGraphComponent', () => {
  let component: FamilyTreeGraphComponent;
  let fixture: ComponentFixture<FamilyTreeGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyTreeGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyTreeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
