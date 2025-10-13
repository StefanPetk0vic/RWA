import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slot-machine',
  imports: [],
  templateUrl: './slot-machine.html',
  styleUrl: './slot-machine.scss',
})
export class SlotMachine {
  constructor(private router: Router) {}
  ngOnInit() {
    const gamesRaw = sessionStorage.getItem('games');
    if (!gamesRaw) {
      this.router.navigate(['/home/404']);
      return;
    }

    const games = JSON.parse(gamesRaw.replace(/^games:/, ''));
    const game = games.find((g: any) => g.name === 'slotmachine');

    if (!game || !game.enabled) {
      this.router.navigate(['/home/404']);
    }
  }
}
