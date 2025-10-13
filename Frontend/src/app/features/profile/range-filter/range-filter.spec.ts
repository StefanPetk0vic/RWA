import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeFilter } from './range-filter';

describe('RangeFilter', () => {
  let component: RangeFilter;
  let fixture: ComponentFixture<RangeFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
