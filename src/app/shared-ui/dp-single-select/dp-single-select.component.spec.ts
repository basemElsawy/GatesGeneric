import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpSingleSelectComponent } from './dp-single-select.component';

describe('DpSingleSelectComponent', () => {
  let component: DpSingleSelectComponent;
  let fixture: ComponentFixture<DpSingleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpSingleSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpSingleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
