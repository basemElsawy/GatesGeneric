import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleClassesComponent } from './vehicle-classes.component';

describe('VehicleClassesComponent', () => {
  let component: VehicleClassesComponent;
  let fixture: ComponentFixture<VehicleClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleClassesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
