import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { BetFilter } from '../bet-filter/bet-filter';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface Game {
  id: number;
  name: string;
}
interface Round {
  id: number;
  result: string;
  game: Game;
}
interface Bet {
  id: number;
  round: Round;
  amount: number;
  status: string;
  payout: number;
  prediction: string;
}

@Component({
  selector: 'app-bets',
  templateUrl: './bets.html',
  imports: [CommonModule, BetFilter],
  styleUrl: './bets.scss',
})
export class Bets implements OnInit {
  private allBets$ = new BehaviorSubject<Bet[]>([]);
  private filter$ = new BehaviorSubject<string | null>(null);

  filteredBets$ = combineLatest([this.allBets$, this.filter$]).pipe(
    map(([bets, status]) => (status ? bets.filter((b) => b.status === status) : bets))
  );

  constructor(private http: HttpClient) {}

  private readonly API_URL = environment.KEY_TO_READ;

  ngOnInit() {
    this.http.get<Bet[]>(`${this.API_URL}/bets/All-Bets`, { withCredentials: true }).subscribe({
      next: (data) => this.allBets$.next(data),
      error: (err) => console.error('Bets load failed:', err),
    });
  }

  onFilterChange(status: string | null) {
    this.filter$.next(status);
  }

  getGameImage(gameName: string): string {
    const cleanName = gameName.toLowerCase().endsWith('dev') ? gameName.slice(0, -3) : gameName;
    return cleanName;
  }

  CheckForDev(gameName: string): string {
    if (gameName.toLowerCase().endsWith('dev')) {
      return gameName.slice(0, -3) + ' dev';
    }
    return gameName;
  }
}
