import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotSatisfactoryListComponent } from './not-satisfactory-list.component';

describe('NotSatisfactoryListComponent', () => {
  let component: NotSatisfactoryListComponent;
  let fixture: ComponentFixture<NotSatisfactoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotSatisfactoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotSatisfactoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
