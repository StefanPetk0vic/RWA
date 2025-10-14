// coin-flip.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceBet } from './coin-bet/place-bet';
import { CoinResult } from './coin-result/coin-result';
import { GameService } from '../../../shared/services/game.service';

@Component({
  selector: 'app-coin-flip',
  imports: [PlaceBet, CoinResult],
  templateUrl: './coin-flip.html',
  styleUrl: './coin-flip.scss',
})
export class CoinFlip {
  resetTrigger = 0;
  coinResultData = {
    result: null as string | null,
    betStatus: null as string | null,
    displayedBetAmount: null as number | null,
    payout: null as number | null,
    coinImage: 'heads' as 'heads' | 'tails',
  };

  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit() {
    const gamesRaw = sessionStorage.getItem('games');
    if (!gamesRaw) {
      this.router.navigate(['/home/404']);
      return;
    }

    const games = JSON.parse(gamesRaw.replace(/^games:/, ''));
    const game = games.find((g: any) => g.name === 'coinflip');

    if (!game || !game.enabled) {
      this.router.navigate(['/home/404']);
    }
  }

  updateCoinResult(data: typeof this.coinResultData) {
    this.coinResultData = { ...this.coinResultData, ...data };
  }

  onPlayAgain(): void {
    this.coinResultData = {
      result: null,
      betStatus: null,
      displayedBetAmount: null,
      payout: null,
      coinImage: 'heads',
    };
    this.resetTrigger++;
    this.gameService.startGame('coinflip', '/coinflip');
  }
}
