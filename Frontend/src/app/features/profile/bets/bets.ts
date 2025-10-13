import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { BetFilter } from '../bet-filter/bet-filter';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { RangeFilter } from '../range-filter/range-filter';
import { SymbolService } from '../../../shared/services/symbol.service';

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
  imports: [CommonModule, BetFilter, RangeFilter],
  styleUrl: './bets.scss',
})
export class Bets implements OnInit {
  constructor(private http: HttpClient, private themeService: SymbolService) {
    this.isDark$ = this.themeService.darkMode$;
  }

  private allBets$ = new BehaviorSubject<Bet[]>([]);
  private filter$ = new BehaviorSubject<string | null>(null);
  private range$ = new BehaviorSubject<{ min: number; max: number } | null>(null);
  private rangeInput$ = new Subject<{ min: number; max: number }>();
  public isDark$: Observable<boolean>;

  filteredBets$ = combineLatest([this.allBets$, this.filter$, this.range$]).pipe(
    map(([bets, status, range]) => {
      let filtered = bets;
      if (status) {
        filtered = filtered.filter((b) => b.status === status);
      }
      if (range) {
        filtered = filtered.filter((b) => b.payout >= range.min && b.payout <= range.max);
      }
      return filtered;
    })
  );

  private readonly API_URL = environment.KEY_TO_READ;
  minPayout = 0;
  maxPayout = 0;

  ngOnInit() {
    this.http.get<Bet[]>(`${this.API_URL}/bets/All-Bets`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.allBets$.next(data);

        if (data.length) {
          const payouts = data.map((b) => b.payout);
          this.minPayout = Math.min(...payouts);
          this.maxPayout = Math.max(...payouts);
          this.range$.next({ min: this.minPayout, max: this.maxPayout });
        }
      },
      error: (err) => console.error('Bets load failed:', err),
    });
    this.rangeInput$.pipe(debounceTime(300)).subscribe((range) => {
      console.log(`Filter - Debounce time ${range.min}, ${range.max}`);
      this.range$.next(range);
    });
  }

  onFilterChange(status: string | null) {
    this.filter$.next(status);
  }

  onRangeChange(range: { min: number; max: number }) {
    console.log(range.min, range.max);
    this.rangeInput$.next(range);
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
