import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinFlipService {
    async flipCoin(): Promise<'heads' | 'tails'> {
        return Math.random() < 0.5 ? 'heads' : 'tails';
    }


    calculatePayout(prediction: 'heads' | 'tails', result: 'heads' | 'tails', betAmount: number): number {
        return prediction === result ? betAmount * 2 : 0;
    }
}
