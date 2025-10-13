import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetGames, Game } from './get-games.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly API_URL = environment.KEY_TO_READ;
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  public games$ = this.gamesSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private getGames: GetGames) {
    this.loadGamesFromSession();
  }

  private loadGamesFromSession() {
    const raw = sessionStorage.getItem('games');
    if (!raw) return;
    try {
      const games = JSON.parse(raw.replace(/^games:/, ''));
      this.gamesSubject.next(games);
    } catch {
      sessionStorage.removeItem('games');
    }
  }

  fetchGames() {
    if (this.gamesSubject.getValue().length > 0) return;

    this.getGames.getAllGames('user').subscribe({
      next: (games) => {
        this.gamesSubject.next(games);
        sessionStorage.setItem('games', `games:${JSON.stringify(games)}`);
      },
      error: (err) => console.error('Error fetching games:', err),
    });
  }

  getGameByName(name: string) {
    const games = this.gamesSubject.getValue();
    return games.find((g) => g.name.toLowerCase() === name.toLowerCase());
  }

  isEnabled(name: string): boolean {
    return !!this.getGameByName(name)?.enabled;
  }

  startGame(gameName: string, redirectUrl: string) {
    const game = this.getGameByName(gameName);
    if (!game) {
      console.error(`Game "${gameName}" not found`);
      return;
    }
    if (!game.enabled) {
      console.warn(`Game "${gameName}" is disabled. Cannot start.`);
      return;
    }

    this.http
      .post(`${this.API_URL}/rounds/start`, { gameId: game.id }, { withCredentials: true })
      .subscribe({
        next: () => this.router.navigate(['/home' + redirectUrl]),
        error: (err) => console.error(err),
      });
  }
}
