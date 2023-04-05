import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOptionsComponent } from './company-options.component';

describe('CompanyOptionsComponent', () => {
  let component: CompanyOptionsComponent;
  let fixture: ComponentFixture<CompanyOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyOptionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CompanyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
