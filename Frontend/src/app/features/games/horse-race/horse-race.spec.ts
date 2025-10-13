import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseRace } from './horse-race';

describe('HorseRace', () => {
  let component: HorseRace;
  let fixture: ComponentFixture<HorseRace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseRace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorseRace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
