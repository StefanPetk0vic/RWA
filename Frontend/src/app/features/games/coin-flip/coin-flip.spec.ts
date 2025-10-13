import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinFlip } from './coin-flip';

describe('CoinFlip', () => {
  let component: CoinFlip;
  let fixture: ComponentFixture<CoinFlip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinFlip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinFlip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
