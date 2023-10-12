import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWithDropDownComponent } from './search-with-drop-down.component';

describe('SearchWithDropDownComponent', () => {
  let component: SearchWithDropDownComponent;
  let fixture: ComponentFixture<SearchWithDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchWithDropDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchWithDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
