import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyconfigComponent } from './companyconfig.component';

describe('CompanyconfigComponent', () => {
  let component: CompanyconfigComponent;
  let fixture: ComponentFixture<CompanyconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
