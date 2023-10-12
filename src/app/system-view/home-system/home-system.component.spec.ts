import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSystemComponent } from './home-system.component';

describe('HomeSystemComponent', () => {
  let component: HomeSystemComponent;
  let fixture: ComponentFixture<HomeSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
