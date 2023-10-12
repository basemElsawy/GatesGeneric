import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructurePriceComponentComponent } from './structure-price-component.component';

describe('StructurePriceComponentComponent', () => {
  let component: StructurePriceComponentComponent;
  let fixture: ComponentFixture<StructurePriceComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructurePriceComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructurePriceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
