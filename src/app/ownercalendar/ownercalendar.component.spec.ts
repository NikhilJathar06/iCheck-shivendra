import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnercalendarComponent } from './ownercalendar.component';

describe('OwnercalendarComponent', () => {
  let component: OwnercalendarComponent;
  let fixture: ComponentFixture<OwnercalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnercalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnercalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
