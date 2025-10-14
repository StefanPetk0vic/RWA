import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetGames } from './get-games.service';
import { Game } from '../interfaces/game.interface';
import { Round } from '../interfaces/round.interface';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly API_URL = environment.KEY_TO_READ;
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  public games$ = this.gamesSubject.asObservable();
  public currentRoundSubject = new BehaviorSubject<Round | null>(null);
  currentRound$ = this.currentRoundSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private getGames: GetGames) {
    this.loadGamesFromSession();
    const storedRound = sessionStorage.getItem('currentRound');
    if (storedRound) {
      try {
        const round = JSON.parse(storedRound) as Round;
        this.currentRoundSubject.next(round);
        console.log('Restored round from sessionStorage:', round);
      } catch {
        sessionStorage.removeItem('currentRound');
      }
    }
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
      .post<Round>(`${this.API_URL}/rounds/start`, { gameId: game.id }, { withCredentials: true })
      .subscribe({
        next: (round) => {
          this.currentRoundSubject.next(round);

          sessionStorage.setItem('currentRound', JSON.stringify(round));

          this.router.navigate(['/home' + redirectUrl]);
        },
        error: (err) => console.error(err),
      });
  }
}
