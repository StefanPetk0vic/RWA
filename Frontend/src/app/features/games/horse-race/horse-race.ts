import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horse-race',
  imports: [],
  templateUrl: './horse-race.html',
  styleUrl: './horse-race.scss',
})
export class HorseRace {
  constructor(private router: Router) {}
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
}
