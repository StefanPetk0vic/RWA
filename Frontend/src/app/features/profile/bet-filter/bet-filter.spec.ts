import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetFilter } from './bet-filter';

describe('BetFilter', () => {
  let component: BetFilter;
  let fixture: ComponentFixture<BetFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
