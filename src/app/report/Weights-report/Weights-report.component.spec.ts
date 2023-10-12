/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WeightsReportComponent } from './Weights-report.component';

describe('WeightsReportComponent', () => {
  let component: WeightsReportComponent;
  let fixture: ComponentFixture<WeightsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
