import { Injectable } from '@nestjs/common';

@Injectable()
export class SlotMachineService {
  private readonly symbols: string[] = [
    '🍒',
    '⭐',
    '7',
    '🎁',
    '💎',
    '🍋',
    '🍀',
    '🔔',
    '🍉',
  ];
  private readonly rows = 3;
  private readonly reels = 3;

  // 🎰 Symbol payout configuration
  private readonly payoutTable: Record<string, { three: number; two: number }> =
    {
      '💎': { three: 10, two: 1 },
      '7': { three: 7, two: 1 },
      '🎁': { three: 6, two: 0.8 },
      '🍀': { three: 5, two: 0.7 },
      '⭐': { three: 4, two: 0.6 },
      '🔔': { three: 3, two: 0.5 },
      '🍒': { three: 2, two: 0.5 },
      '🍋': { three: 1.5, two: 0.5 },
      '🍉': { three: 1.2, two: 0.5 },
    };

  /**
   * Spins the slot machine and returns the result grid as a serialized string.
   */
  async spin(): Promise<string> {
    const grid: string[][] = Array.from({ length: this.rows }, () =>
      Array.from(
        { length: this.reels },
        () => this.symbols[Math.floor(Math.random() * this.symbols.length)],
      ),
    );

    return grid.map((row) => row.join('-')).join('|');
  }

  /**
   * Calculates the payout based on the result grid and bet amount.
   * Uses the payout table to scale winnings by symbol rarity/value.
   */
  calculatePayout(result: string, amount: number): number {
    const rows = result.split('|').map((r) => r.split('-'));
    const cols = [0, 1, 2].map((i) => rows.map((r) => r[i]));
    const diagonals = [
      [rows[0][0], rows[1][1], rows[2][2]],
      [rows[0][2], rows[1][1], rows[2][0]],
    ];

    const lines = [...rows, ...cols, ...diagonals];
    let totalPayout = 0;

    for (const line of lines) {
      const [a, b, c] = line;

      const allEqual = a === b && b === c;
      const hasTwoEqual = a === b || b === c || a === c;

      if (allEqual) {
        totalPayout += amount * (this.payoutTable[a]?.three ?? 1);
      } else if (hasTwoEqual) {
        const symbol = this.findPairSymbol(a, b, c);
        totalPayout += amount * (this.payoutTable[symbol]?.two ?? 0.5);
      }
    }

    return totalPayout;
  }

  /**
   * Helper method to identify which symbol forms the pair in a 2-match line.
   */
  private findPairSymbol(a: string, b: string, c: string): string {
    if (a === b) return a;
    if (b === c) return b;
    if (a === c) return a;
    return a; // fallback, shouldn't happen
  }
}
