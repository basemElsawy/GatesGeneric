import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateArmComponent } from './gate-arm.component';

describe('GateArmComponent', () => {
  let component: GateArmComponent;
  let fixture: ComponentFixture<GateArmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GateArmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GateArmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
