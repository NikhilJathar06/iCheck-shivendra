import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleDialogComponent } from './toggle-dialog.component';

describe('ToggleDialogComponent', () => {
  let component: ToggleDialogComponent;
  let fixture: ComponentFixture<ToggleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
