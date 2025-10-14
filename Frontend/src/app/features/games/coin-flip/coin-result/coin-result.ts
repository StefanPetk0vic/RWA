import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SymbolService } from '../../../../shared/services/symbol.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coin-result',
  imports: [CommonModule],
  templateUrl: './coin-result.html',
  styleUrl: './coin-result.scss',
})
export class CoinResult {
  public isDark$: Observable<boolean>;
  @Input() coinResultData!: {
    result: string | null;
    betStatus: string | null;
    displayedBetAmount: number | null;
    payout: number | null;
    coinImage: 'heads' | 'tails';
  };

  constructor(private themeService: SymbolService) {
    this.isDark$ = this.themeService.darkMode$;
  }
}
