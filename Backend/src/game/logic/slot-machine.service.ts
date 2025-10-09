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

    calculatePayout(result: string, amount: number): number {
        
        const rows = result.split('|').map(r => r.split('-'));

        const cols = [0, 1, 2].map(colIndex => rows.map(row => row[colIndex]));

        const diagonals = [
            [rows[0][0], rows[1][1], rows[2][2]],
            [rows[0][2], rows[1][1], rows[2][0]]
        ];

        const lines = [...rows, ...cols, ...diagonals];

        let totalPayout = 0;

        lines.forEach(line => {
            const allEqual = line.every(sym => sym === line[0]);
            const twoEqual = line.filter(sym => sym === line[0]).length === 2;

            if (allEqual) totalPayout += amount * 5;
            else if (twoEqual) totalPayout += amount * 0.5;
        });

        return totalPayout;
    }

}