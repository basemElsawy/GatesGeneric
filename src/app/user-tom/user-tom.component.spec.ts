import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTOMComponent } from './user-tom.component';

describe('UserTOMComponent', () => {
  let component: UserTOMComponent;
  let fixture: ComponentFixture<UserTOMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTOMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
