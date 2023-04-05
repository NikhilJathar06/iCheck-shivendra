import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditvesselComponent } from './editvessel.component';

describe('EditvesselComponent', () => {
  let component: EditvesselComponent;
  let fixture: ComponentFixture<EditvesselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditvesselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditvesselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
