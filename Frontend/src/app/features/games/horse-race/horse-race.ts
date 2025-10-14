import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HorseBet } from './horse-bet/horse-bet';
import { HorseResult } from './horse-result/horse-result';
import { GameService } from '../../../shared/services/game.service';

@Component({
  selector: 'app-horse-race',
  imports: [HorseBet, HorseResult],
  templateUrl: './horse-race.html',
  styleUrl: './horse-race.scss',
})
export class HorseRace {
  @ViewChild(HorseBet) horseBet!: HorseBet;
  @ViewChild(HorseResult) horseResult!: HorseResult;

  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit() {
    const gamesRaw = sessionStorage.getItem('games');
    if (!gamesRaw) {
      this.router.navigate(['/home/404']);
      return;
    }

    const games = JSON.parse(gamesRaw.replace(/^games:/, ''));
    const game = games.find((g: any) => g.name === 'horserace');

    if (!game || !game.enabled) {
      this.router.navigate(['/home/404']);
    }
  }

  onPlayAgain(): void {
    if (this.horseBet) this.horseBet.resetBet();
    if (this.horseResult) this.horseResult.resetPositions();
    this.gameService.startGame('horserace', '/horserace');
  }
}
