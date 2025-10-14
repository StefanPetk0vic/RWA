import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinResult } from './coin-result';

describe('CoinResult', () => {
  let component: CoinResult;
  let fixture: ComponentFixture<CoinResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
