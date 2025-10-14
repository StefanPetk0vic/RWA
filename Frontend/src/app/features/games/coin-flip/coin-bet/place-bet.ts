import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { SymbolService } from '../../../../shared/services/symbol.service';
import { PlaceBetService } from '../../../../shared/services/place-bet.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-place-bet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-bet.html',
  styleUrls: ['./place-bet.scss'],
})
export class PlaceBet {
  public isDark$: Observable<boolean>;
  @Input() resetTrigger = 0;

  @Output() betPlaced = new EventEmitter<{
    result: string | null;
    betStatus: string | null;
    displayedBetAmount: number | null;
    payout: number | null;
    coinImage: 'heads' | 'tails';
  }>();

  betAmount: number | null = null;
  selectedPrediction: 'heads' | 'tails' | null = null;

  // Coin flip animation
  coinImage: 'heads' | 'tails' = 'heads';
  animationSteps = 12;

  // Result placeholders
  result: string | null = null;
  betStatus: string | null = null;
  payout: number | null = null;
  displayedBetAmount: number | null = null;

  constructor(
    private themeService: SymbolService,
    private placeBetService: PlaceBetService,
    private http: HttpClient
  ) {
    this.isDark$ = this.themeService.darkMode$;
  }

  selectPrediction(choice: 'heads' | 'tails') {
    this.selectedPrediction = choice;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetTrigger']) {
      this.betAmount = null;
      this.selectedPrediction = null;
    }
  }
  async PlaceBet() {
    if (!this.betAmount || this.betAmount <= 0) {
      console.error('Enter a valid bet amount');
      return;
    }
    if (!this.selectedPrediction) {
      console.error('Select heads or tails');
      return;
    }

    try {
      const data = await this.http
        .get<{ balance: number }>('http://127.0.0.1:3000/user/me/balance', {
          withCredentials: true,
        })
        .toPromise();

      if (!data) {
        console.error('Failed to get user balance');
        return;
      }

      let userBalance = data.balance;

      if (userBalance < this.betAmount) {
        console.error('Not enough credit');
        return;
      }
      userBalance = userBalance - this.betAmount;

      const userRaw = sessionStorage.getItem('user');
      let user = userRaw ? JSON.parse(userRaw) : {};
      user.Credit = userBalance;
      sessionStorage.setItem('user', JSON.stringify(user));

      const currentRoundId = this.placeBetService['currentRound']?.id;
      if (!currentRoundId) {
        console.error('No active round to place bet');
        return;
      }

      const betResponse: any = await this.placeBetService.placeBet({
        roundId: currentRoundId,
        amount: this.betAmount,
        prediction: this.selectedPrediction,
      });

      const roundId = betResponse.roundId || this.placeBetService['currentRound']?.id;
      if (!roundId) return;

      const roundResult: any = await this.placeBetService.resolveRound(roundId);

      const userBet = roundResult.bets[0];
      if (!userBet) return;

      await this.startCoinFlipAnimation(roundResult.result, userBet);
    } catch (err) {
      console.error('Error placing bet:', err);
    }
  }

  async startCoinFlipAnimation(finalResult: 'heads' | 'tails', bet: any) {
    const maxSteps = this.animationSteps;
    let currentImage: 'heads' | 'tails' = this.coinImage;

    for (let step = 0; step < maxSteps; step++) {
      currentImage = currentImage === 'heads' ? 'tails' : 'heads';
      this.coinImage = currentImage;

      this.betPlaced.emit({
        result: null,
        betStatus: null,
        displayedBetAmount: null,
        payout: null,
        coinImage: currentImage,
      });

      const delay = 50 + step * 30;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.coinImage = finalResult;
    this.result = finalResult;
    this.betStatus = bet.status;
    this.displayedBetAmount = bet.amount;
    this.payout = bet.payout;

    this.betPlaced.emit({
      result: this.result,
      betStatus: this.betStatus,
      displayedBetAmount: this.displayedBetAmount,
      payout: this.payout,
      coinImage: this.coinImage,
    });
  }
}
