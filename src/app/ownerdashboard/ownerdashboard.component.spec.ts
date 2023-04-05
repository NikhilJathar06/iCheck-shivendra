import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerdashboardComponent } from './ownerdashboard.component';

describe('OwnerdashboardComponent', () => {
  let component: OwnerdashboardComponent;
  let fixture: ComponentFixture<OwnerdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
