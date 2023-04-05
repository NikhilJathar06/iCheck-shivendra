import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenissuesComponent } from './openissues.component';

describe('OpenissuesComponent', () => {
  let component: OpenissuesComponent;
  let fixture: ComponentFixture<OpenissuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenissuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
