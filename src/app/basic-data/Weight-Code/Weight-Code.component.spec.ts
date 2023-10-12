/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WeightCodeComponent } from './Weight-Code.component';

describe('WeightCodeComponent', () => {
  let component: WeightCodeComponent;
  let fixture: ComponentFixture<WeightCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
