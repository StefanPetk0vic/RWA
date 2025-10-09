import { Injectable } from "@nestjs/common";

@Injectable()
export class HorseRaceService {
    private horses = ['Lightning', 'Thunder', 'Blaze', 'Rocket', 'Spirit', 'Dance'];

    async winningHorse(): Promise<string> {
        const winner = this.horses[Math.floor(Math.random() * this.horses.length)];
        return winner;
    }

    calculatePayout(prediction: string, result: string, amount: number): number {
        if (prediction === result) {
            return amount * 2;
        }
        return 0;
    }
}