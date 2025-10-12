import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Game {
  id: number;
  name: string;
  developer?: string;
  enabled?: string;
  updatedAt?:Date;
}

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private readonly API_URL = environment.KEY_TO_READ;

  constructor(private http: HttpClient) {}

  getAllGames(userPermission: 'admin' | 'developer' | 'user' | null): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.API_URL}/game`);
  }
}
