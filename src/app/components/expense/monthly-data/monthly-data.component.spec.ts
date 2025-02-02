import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyDataComponent } from './monthly-data.component';

describe('MonthlyDataComponent', () => {
  let component: MonthlyDataComponent;
  let fixture: ComponentFixture<MonthlyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
