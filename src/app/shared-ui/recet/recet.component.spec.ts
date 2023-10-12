import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetComponent } from './recet.component';

describe('RecetComponent', () => {
  let component: RecetComponent;
  let fixture: ComponentFixture<RecetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
