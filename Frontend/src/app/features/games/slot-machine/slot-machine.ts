import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceBetService } from '../../../shared/services/place-bet.service';
import { BetPayload } from '../../../shared/interfaces/bet.interface';
import { GameService } from '../../../shared/services/game.service';

@Component({
  selector: 'app-slot-machine',
  imports: [CommonModule, FormsModule],
  templateUrl: './slot-machine.html',
  styleUrl: './slot-machine.scss',
})
export class SlotMachine {
  betAmount: number | null = null;

  symbols: string[] = ['🍒', '⭐', '7', '🎁', '💎', '🍋', '🍀', '🔔', '🍉'];
  displayGrid: string[][] = [
    ['🍒', '⭐', '7'],
    ['🎁', '💎', '🍋'],
    ['🍀', '🔔', '🍉'],
  ];

  spinning = false;
  private spinInterval?: any;

  constructor(private placeBetService: PlaceBetService, private gameService: GameService) {}

  async placeBet(): Promise<void> {
    if (!this.betAmount || this.spinning) return;
    this.spinning = true;

    if (this.spinInterval) {
      clearInterval(this.spinInterval);
      this.spinInterval = undefined;
    }

    const storedRound = sessionStorage.getItem('currentRound');
    if (!storedRound) {
      console.error('No round in sessionStorage');
      this.spinning = false;
      return;
    }
    const roundId = JSON.parse(storedRound).id;

    const payload: BetPayload = {
      roundId,
      amount: this.betAmount,
      prediction: '',
    };

    try {
      const betResponse = await this.placeBetService.placeBet(payload);
      if (!betResponse) return;
      const roundResult = await this.placeBetService.resolveRound(roundId);
      if (!roundResult?.result) {
        console.error('Round result is missing!');
        this.spinning = false;
        return;
      }
      const finalGrid: string[][] = roundResult.result
        .split('|')
        .map((row: string) => row.split('-'));

      if (finalGrid.length !== 3 || finalGrid.some((row) => row.length !== 3)) {
        console.error('Final grid is not 3x3:', finalGrid);
        this.spinning = false;
        return;
      }

      await this.spinAnimation(finalGrid);
    } catch (err) {
      console.error(err);
    } finally {
      this.spinning = false;
    }
  }

  private spinAnimation(finalGrid: string[][]): Promise<void> {
    return new Promise((resolve) => {
      const totalTicks = 20;
      let tick = 0;

      this.spinInterval = setInterval(() => {
        this.displayGrid = this.displayGrid.map((row, r) =>
          row.map((cell, c) =>
            tick >= totalTicks
              ? finalGrid[r][c]
              : this.symbols[Math.floor(Math.random() * this.symbols.length)]
          )
        );

        tick++;
        if (tick > totalTicks) {
          clearInterval(this.spinInterval);
          this.spinInterval = undefined;
          resolve();
        }
      }, 100);
    });
  }

  onPlayAgain(): void {
    this.betAmount = null;
    this.displayGrid = [
      ['🍒', '⭐', '7'],
      ['🎁', '💎', '🍋'],
      ['🍀', '🔔', '🍉'],
    ];
    this.spinning = false;

    if (this.spinInterval) {
      clearInterval(this.spinInterval);
      this.spinInterval = undefined;
    }
    this.gameService.startGame('slotmachine', '/slotmachine');
  }
}
