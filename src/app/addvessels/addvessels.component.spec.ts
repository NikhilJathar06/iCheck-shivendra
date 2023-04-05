import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvesselsComponent } from './addvessels.component';

describe('AddvesselsComponent', () => {
  let component: AddvesselsComponent;
  let fixture: ComponentFixture<AddvesselsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddvesselsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddvesselsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
