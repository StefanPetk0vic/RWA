import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HorseRaceService {
  private winnerSubject = new Subject<string>();
  winner$ = this.winnerSubject.asObservable();

  announceWinner(name: string) {
    this.winnerSubject.next(name);
  }
}
