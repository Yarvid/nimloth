import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeVisualizationComponent } from './tree-visualization.component';

describe('TreeVisualizationComponent', () => {
  let component: TreeVisualizationComponent;
  let fixture: ComponentFixture<TreeVisualizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TreeVisualizationComponent, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(TreeVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
