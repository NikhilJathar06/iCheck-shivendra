import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenobservationComponent } from './openobservation.component';

describe('OpenobservationComponent', () => {
  let component: OpenobservationComponent;
  let fixture: ComponentFixture<OpenobservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenobservationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenobservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
