import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselconfigComponent } from './vesselconfig.component';

describe('VesselconfigComponent', () => {
  let component: VesselconfigComponent;
  let fixture: ComponentFixture<VesselconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VesselconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VesselconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
