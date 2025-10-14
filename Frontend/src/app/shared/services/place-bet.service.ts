import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BetPayload } from '../interfaces/bet.interface';
import { GameService } from './game.service';
import { HttpClient } from '@angular/common/http';
import { Round } from '../interfaces/round.interface';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlaceBetService {
  private currentRound: Round | null = null;

  constructor(private gameService: GameService, private http: HttpClient) {
    this.gameService.currentRound$.subscribe((round) => {
      if (round) {
        console.log('Current round updated:', round);
        this.currentRound = round;
        sessionStorage.setItem('currentRound', JSON.stringify(round));
      } else {
        sessionStorage.removeItem('currentRound');
      }
    });

    const storedRound = sessionStorage.getItem('currentRound');
    if (storedRound) {
      try {
        this.currentRound = JSON.parse(storedRound) as Round;
        console.log('Restored round from sessionStorage:', this.currentRound);
      } catch {
        console.warn('Invalid sessionStorage round — clearing it');
        sessionStorage.removeItem('currentRound');
      }
    }
  }

  async placeBet(payload: BetPayload) {
    if (!this.currentRound) {
      const storedRound = sessionStorage.getItem('currentRound');
      if (storedRound) {
        try {
          this.currentRound = JSON.parse(storedRound) as Round;
        } catch {
          console.warn('Corrupted stored round');
        }
      }
    }

    if (!this.currentRound) {
      console.error('No active round. Cannot place bet.');
      return;
    }

    const body = {
      roundId: this.currentRound.id,
      amount: payload.amount,
      prediction: payload.prediction,
    };

    try {
      const response = await firstValueFrom(
        this.http.post(`${environment.KEY_TO_READ}/bets`, body, { withCredentials: true })
      );
      console.log('Bet response:', response);
      return response;
    } catch (err) {
      console.error('Failed to place bet:', err);
      throw err;
    }
  }

  async resolveRound(roundId: number) {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(
          `${environment.KEY_TO_READ}/rounds/${roundId}/resolve`,
          {},
          { withCredentials: true }
        )
      );
      console.log('Round resolved:', response);
      return response;
    } catch (err) {
      console.error('Failed to resolve round:', err);
      throw err;
    }
  }
}
