import { Injectable } from '@nestjs/common';

@Injectable()
export class SlotMachineService {
    private readonly symbols = ['🍒', '⭐', '7', '🎁', '💎', '🍋'];
    private readonly rows = 3;
    private readonly reels = 3;

    async spin(): Promise<string> {
        const resultArray: string[][] = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.reels }, () => 
                this.symbols[Math.floor(Math.random() * this.symbols.length)]
            )
        );
        const resultString = resultArray.map(row => row.join('-')).join('|'); 
        return resultString;
    }

    calculatePayout(prediction: string[], result: string, amount: number): number {
        const resultSymbols = result.split('-');

        let matches = 0;
        prediction.forEach((sym, i) => {
            if (sym === resultSymbols[i]) matches++;
        });

        if (matches === 3) return amount * 10;
        if (matches === 2) return amount * 3;
        if (matches === 1) return amount * 1.5;

        return 0;
    }

}