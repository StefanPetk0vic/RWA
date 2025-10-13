import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedCard } from './verified-card';

describe('VerifiedCard', () => {
  let component: VerifiedCard;
  let fixture: ComponentFixture<VerifiedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifiedCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiedCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
