import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyvesselconfigComponent } from './companyvesselconfig.component';

describe('CompanyvesselconfigComponent', () => {
  let component: CompanyvesselconfigComponent;
  let fixture: ComponentFixture<CompanyvesselconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyvesselconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyvesselconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
