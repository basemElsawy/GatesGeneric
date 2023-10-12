import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureComponentsComponent } from './structure-components.component';

describe('StructureComponentsComponent', () => {
  let component: StructureComponentsComponent;
  let fixture: ComponentFixture<StructureComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructureComponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
