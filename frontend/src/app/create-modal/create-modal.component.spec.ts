import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateModalComponent } from './create-modal.component';

describe('CreateModalComponent', () => {
  let component: CreateModalComponent;
  let fixture: ComponentFixture<CreateModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateModalComponent, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(CreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
