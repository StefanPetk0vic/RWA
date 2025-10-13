import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinFlipService {
  async flipCoin(): Promise<'heads' | 'tails'> {
    const random = Math.floor(Math.random() * 1000 + (Date.now() % 1000));
    return random % 2 === 0 ? 'heads' : 'tails';
  }

  calculatePayout(
    prediction: 'heads' | 'tails',
    result: 'heads' | 'tails',
    betAmount: number,
  ): number {
    return prediction === result ? betAmount * 2 : 0;
  }
}
