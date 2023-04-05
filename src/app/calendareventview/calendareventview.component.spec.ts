import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendareventviewComponent } from './calendareventview.component';

describe('CalendareventviewComponent', () => {
  let component: CalendareventviewComponent;
  let fixture: ComponentFixture<CalendareventviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendareventviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendareventviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
