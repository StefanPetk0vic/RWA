import { Injectable } from '@nestjs/common';
import { Round } from 'src/round/entities/round.entity';
import { CoinFlipService } from '../../game/logic/coinflip.service';
import { BetService } from 'src/bet/bet.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Bet } from 'src/bet/entities/bet.entity';
import { TransactionType } from 'src/transaction/entities/transaction.entity';
import { SlotMachineService } from '../../game/logic/slotMachine.service';
//import { BlackjackService } from './blackjack.service';
import { HorseRaceService } from '../../game/logic/horserace.service';

@Injectable()
export class RoundResolver {
    constructor(
        private readonly coinFlipService: CoinFlipService,
        private readonly slotMachineService: SlotMachineService,
        private readonly horseRaceService: HorseRaceService,
        //private readonly blackjackService: BlackjackService,
        private readonly betService: BetService,
        private readonly txService: TransactionService,
    ) { }

    async resolveRound(round: Round) {

        const gameName = round.game.name.toLowerCase();

        let result: string;

        switch (gameName) {
            case 'coinflip':
                result = await this.coinFlipService.flipCoin();
                break;
            case 'slotmachine':
                result = await this.slotMachineService.spin();
                break;
            case 'horserace':
                result = await this.horseRaceService.winningHorse();
                break;


            //TODO: unlike the other 3 games this one uses resolveRound() to finish its game
            //because it is a multi-stage game.
            //-----ZAPAMTI-----
            //blackjack and poker are the only games that require this type of structure
            //the others finish in one go

            //case 'blackjack':
            //result = await this.blackjackService.finishRound(round);
            //break;

            default:
                throw new Error(`Game logic not implemented for ${gameName}`);
        }


        round.status = 'finished';
        round.result = result;

        const bets = await this.betService.getRoundBets(round.id);
        let payout:number = 0;

        const resolvedBets: Bet[] = [];

        for (const bet of bets) {
            payout = 0;

            switch (gameName) {
                case 'coinflip':
                    payout = this.coinFlipService.calculatePayout(
                        bet.prediction,
                        result as 'heads' | 'tails',
                        bet.amount,
                    );
                    break;
                case 'slotmachine':
                    payout = this.slotMachineService.calculatePayout(
                        bet.prediction,
                        result,
                        bet.amount,
                    );
                    break;
                case 'horserace':
                    payout = this.horseRaceService.calculatePayout(
                        bet.prediction,
                        result,
                        bet.amount,
                    );
                    break;
                default:
                    throw new Error(`Payout calculation not implemented for ${gameName}`);
            }

            const status = payout > 0 ? 'won' : 'lost';
            bet.status = status as Bet['status'];
            bet.payout = payout;

            await this.betService.updateBet(bet.id, {
                status: bet.status,
                payout: bet.payout,
            });

            if (payout > 0) {
                await this.txService.createTransaction(
                    bet.user,
                    round,
                    payout,
                    this.getTransactionTypeFromGame(gameName),
                );
            }

            resolvedBets.push(bet);
        }


        return {
            result,
            bets: resolvedBets,
            payout
        };
    }

    private getTransactionTypeFromGame(gameName: string): TransactionType {
        switch (gameName.toLowerCase()) {
            case 'coinflip': return TransactionType.COINFLIP;
            case 'blackjack': return TransactionType.BLACKJACK;
            case 'slotmachine':
            case 'slots': return TransactionType.SLOTMACHINE;
            case 'gift': return TransactionType.GIFT;
            default:
                throw new Error(`Unknown game type: ${gameName}`);
        }
    }
}
