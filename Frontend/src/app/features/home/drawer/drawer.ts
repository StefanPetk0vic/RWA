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
  constructor(private drawerService: DrawerService) {}
  games: Game[] = [];
  ngOnInit() {
    this.drawerService.getAllGames('user').subscribe({
      next: (games) => (this.games = games),
      error: (err) => console.error('Error loading games:', err),
    });
  }
}
