import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GameService } from '../../../shared/services/game.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
})
export class Carousel implements OnInit {
  games: any[] = [];

  constructor(private gameService: GameService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.gameService.games$.subscribe((games) => {
      this.games = games;
      this.cd.markForCheck();
    });
  }

  isEnabled(name: string): boolean {
    return !!this.games.find((g) => g.name === name)?.enabled;
  }

  startCoinFlip() {
    this.gameService.startGame('coinflip', '/coinflip');
  }

  startHorseRace() {
    this.gameService.startGame('horserace', '/horserace');
  }

  startSlotMachine() {
    this.gameService.startGame('slotmachine', '/slotmachine');
  }
}
