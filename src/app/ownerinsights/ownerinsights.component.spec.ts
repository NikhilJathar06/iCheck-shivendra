import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerinsightsComponent } from './ownerinsights.component';

describe('OwnerinsightsComponent', () => {
  let component: OwnerinsightsComponent;
  let fixture: ComponentFixture<OwnerinsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerinsightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerinsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
