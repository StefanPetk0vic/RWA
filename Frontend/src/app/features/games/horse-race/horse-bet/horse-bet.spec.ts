import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseBet } from './horse-bet';

describe('HorseBet', () => {
  let component: HorseBet;
  let fixture: ComponentFixture<HorseBet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseBet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorseBet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
