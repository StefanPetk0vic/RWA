import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameService } from './shared/services/game.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Frontend');
  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.fetchGames();
  }
}
