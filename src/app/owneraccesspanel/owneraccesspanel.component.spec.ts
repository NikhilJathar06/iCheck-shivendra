import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwneraccesspanelComponent } from './owneraccesspanel.component';

describe('OwneraccesspanelComponent', () => {
  let component: OwneraccesspanelComponent;
  let fixture: ComponentFixture<OwneraccesspanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwneraccesspanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwneraccesspanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
