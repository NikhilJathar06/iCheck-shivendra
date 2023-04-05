import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpdialogComponent } from './otpdialog.component';

describe('OtpdialogComponent', () => {
  let component: OtpdialogComponent;
  let fixture: ComponentFixture<OtpdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
