import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HorseRaceService } from '../../../../shared/services/horse-race.service';

@Component({
  selector: 'app-horse-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horse-result.html',
  styleUrl: './horse-result.scss',
})
export class HorseResult implements OnInit, OnDestroy {
  readonly horses = ['Lightning', 'Thunder', 'Blaze', 'Rocket', 'Spirit', 'Dance'] as const;
  horsePositions: Record<string, number> = {};
  winner: string | null = null;
  private interval: any;

  constructor(private horseRaceService: HorseRaceService) {}

  ngOnInit() {
    this.horseRaceService.winner$.subscribe((winner) => {
      this.startRace(winner);
    });
    this.resetPositions();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  resetPositions() {
    this.horsePositions = Object.fromEntries(this.horses.map((h) => [h, 0]));
    this.winner = null;
    clearInterval(this.interval);
  }

  startRace(winningHorse: string) {
    this.resetPositions();
    console.log('Starting race. Winner should be:', winningHorse);

    this.interval = setInterval(() => {
      const maxPosition = Math.max(...Object.values(this.horsePositions));

      for (const horse of this.horses) {
        let move = Math.floor(Math.random() * 3);
        //STOP OTHER HORSES FROM WINNING
        if (horse !== winningHorse && this.horsePositions[horse] === maxPosition) {
          move = 0;
        }

        this.horsePositions[horse] = Math.min(90, this.horsePositions[horse] + move);
      }

      if (this.horsePositions[winningHorse] >= 90) {
        clearInterval(this.interval);
        this.winner = winningHorse;
        console.log('🏆 Race finished! Winner:', winningHorse);
      }
    }, 1000);
  }
}
