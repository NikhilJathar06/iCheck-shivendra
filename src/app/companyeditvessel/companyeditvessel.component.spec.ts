import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyeditvesselComponent } from './companyeditvessel.component';

describe('CompanyeditvesselComponent', () => {
  let component: CompanyeditvesselComponent;
  let fixture: ComponentFixture<CompanyeditvesselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyeditvesselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyeditvesselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
