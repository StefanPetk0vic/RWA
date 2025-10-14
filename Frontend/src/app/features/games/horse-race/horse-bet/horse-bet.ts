import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../../shared/services/game.service';
import { PlaceBetService } from '../../../../shared/services/place-bet.service';
import { BetPayload } from '../../../../shared/interfaces/bet.interface';
import { SymbolService } from '../../../../shared/services/symbol.service';
import { HorseRaceService } from '../../../../shared/services/horse-race.service';

@Component({
  selector: 'app-horse-bet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horse-bet.html',
  styleUrl: './horse-bet.scss',
})
export class HorseBet {
  public isDark$: Observable<boolean>;
  readonly horses = ['Lightning', 'Thunder', 'Blaze', 'Rocket', 'Spirit', 'Dance'] as const;
  betAmount: number | null = null;
  selectedPrediction: (typeof this.horses)[number] | null = null;
  loading = false;

  constructor(
    private themeService: SymbolService,
    private gameService: GameService,
    private placeBetService: PlaceBetService,
    private horseRaceService: HorseRaceService
  ) {
    this.isDark$ = this.themeService.darkMode$;
  }

  selectPrediction(choice: (typeof this.horses)[number]): void {
    this.selectedPrediction = choice;
  }

  async placeBet() {
    if (!this.selectedPrediction || !this.betAmount) {
      console.warn('Please select a horse and enter a bet amount.');
      return;
    }

    this.loading = true;

    let roundId: number | null = null;
    const currentRound = this.gameService.currentRoundSubject.getValue();
    if (currentRound) roundId = currentRound.id;
    else {
      const storedRound = sessionStorage.getItem('currentRound');
      if (storedRound) roundId = (JSON.parse(storedRound) as any).id;
    }

    if (!roundId) {
      console.error('No active round found. Cannot place bet.');
      this.loading = false;
      return;
    }

    const payload: BetPayload = {
      roundId,
      amount: this.betAmount,
      prediction: this.selectedPrediction,
    };

    try {
      const betResponse = await this.placeBetService.placeBet(payload);
      if (!betResponse) return;

      const resolved = await this.placeBetService.resolveRound(roundId);
      if (resolved?.result) {
        this.horseRaceService.announceWinner(resolved.result);
      }
    } catch (err) {
      console.error('Failed to place or resolve bet:', err);
    } finally {
      this.loading = false;
    }
  }
  resetBet() {
    this.selectedPrediction = null;
    this.betAmount = null;
  }
}
