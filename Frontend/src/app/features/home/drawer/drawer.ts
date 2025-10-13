import { Component } from '@angular/core';
import { DrawerService, Game } from './drawer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  imports: [CommonModule],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss',
})
export class Drawer {
  games: Game[] = [];

  constructor(private drawerService: DrawerService) {}

  ngOnInit() {
    const cached = localStorage.getItem('games');
    if (cached) {
      try {
        this.games = JSON.parse(cached);
      } catch {
        localStorage.removeItem('games');
      }
    }

    if (!this.games.length) {
      this.fetchGames();
    }
  }

  private fetchGames() {
    this.drawerService.getAllGames('user').subscribe({
      next: (games) => {
        this.games = games;
        localStorage.setItem('games', JSON.stringify(games));
      },
      error: (err) => console.error('Error loading games:', err),
    });
  }
}
