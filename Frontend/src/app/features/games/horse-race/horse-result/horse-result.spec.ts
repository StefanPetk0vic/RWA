import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseResult } from './horse-result';

describe('HorseResult', () => {
  let component: HorseResult;
  let fixture: ComponentFixture<HorseResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorseResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
