/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GovernoratesComponent } from './governorates.component';

describe('GovernoratesComponent', () => {
  let component: GovernoratesComponent;
  let fixture: ComponentFixture<GovernoratesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernoratesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernoratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
