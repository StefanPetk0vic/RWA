import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { shareReplay } from 'rxjs/operators';
import { Game } from '../interfaces/game.interface';

@Injectable({ providedIn: 'root' })
export class GetGames {
  private readonly API_URL = environment.KEY_TO_READ;

  constructor(private http: HttpClient) {}

  getAllGames(userPermission: 'admin' | 'developer' | 'user' | null): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.API_URL}/game`).pipe(shareReplay(1));
  }
}
