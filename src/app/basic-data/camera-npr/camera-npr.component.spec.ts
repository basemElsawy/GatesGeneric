import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraNPRComponent } from './camera-npr.component';

describe('CameraNPRComponent', () => {
  let component: CameraNPRComponent;
  let fixture: ComponentFixture<CameraNPRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraNPRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraNPRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
