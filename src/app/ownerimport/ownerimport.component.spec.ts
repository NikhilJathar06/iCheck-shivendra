import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerimportComponent } from './ownerimport.component';

describe('OwnerimportComponent', () => {
  let component: OwnerimportComponent;
  let fixture: ComponentFixture<OwnerimportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerimportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
