import { Component } from '@angular/core';
import { PlaceBet } from './place-bet/place-bet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coin-flip',
  imports: [PlaceBet],
  templateUrl: './coin-flip.html',
  styleUrl: './coin-flip.scss',
})
export class CoinFlip {
  constructor(private router: Router) {}
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
}
