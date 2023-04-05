import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectificationComponent } from './rectification.component';

describe('RectificationComponent', () => {
  let component: RectificationComponent;
  let fixture: ComponentFixture<RectificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
