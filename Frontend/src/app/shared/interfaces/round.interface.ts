import { Game } from './game.interface';

export interface Round {
  id: number;
  result: string | null;
  status: 'pending' | 'finished';
  startedAt: string;
  updatedAt: string;
  game: Game;
}
