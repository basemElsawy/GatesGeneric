/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KiloPriceComponent } from './Kilo-Price.component';

describe('KiloPriceComponent', () => {
  let component: KiloPriceComponent;
  let fixture: ComponentFixture<KiloPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KiloPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KiloPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
