import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiDialogComponent } from './noti-dialog.component';

describe('NotiDialogComponent', () => {
  let component: NotiDialogComponent;
  let fixture: ComponentFixture<NotiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotiDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
