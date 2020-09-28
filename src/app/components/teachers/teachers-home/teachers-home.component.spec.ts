import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersHomeComponent } from './teachers-home.component';

describe('TeachersHomeComponent', () => {
  let component: TeachersHomeComponent;
  let fixture: ComponentFixture<TeachersHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachersHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
