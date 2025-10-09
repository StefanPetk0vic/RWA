import { BadRequestException, Injectable } from '@nestjs/common';
import { Round } from 'src/round/entities/round.entity';
import { CoinFlipService } from '../../game/logic/coin-flip.service';
import { BetService } from 'src/bet/bet.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Bet } from 'src/bet/entities/bet.entity';
import { TransactionType } from 'src/transaction/entities/transaction.entity';
import { SlotMachineService } from '../../game/logic/slot-machine.service';
//import { BlackjackService } from './blackjack.service';
import { HorseRaceService } from '../../game/logic/horse-race.service';
import { RoundService } from '../round.service';

@Injectable()
export class RoundResolver {
    constructor(
        private readonly coinFlipService: CoinFlipService,
        private readonly slotMachineService: SlotMachineService,
        private readonly horseRaceService: HorseRaceService,
        //private readonly blackjackService: BlackjackService,
        private readonly betService: BetService,
        private readonly txService: TransactionService,
        private readonly roundService: RoundService,

    ) { }

    async resolveRound(round: Round) {

        if (round.status === 'finished') {
            throw new BadRequestException(`Round ${round.id} has already been resolved`);
        }

        const gameName = round.game.name.toLowerCase();

        let result: string;

        switch (gameName) {
            case 'coinflip':
            case 'coinflipdev':
                result = await this.coinFlipService.flipCoin();
                break;
            case 'slotmachine':
            case 'slotmachinedev':
                result = await this.slotMachineService.spin();
                break;
            case 'horserace':
            case 'horseracedev':

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

        round.result = result;

        const bets = await this.betService.getRoundBets(round.id);
        let payout: number = 0;

        const resolvedBets: Bet[] = [];

        for (const bet of bets) {
            payout = 0;

            switch (gameName) {
                case 'coinflip':
                case 'coinflipdev':

                    payout = this.coinFlipService.calculatePayout(
                        bet.prediction,
                        result as 'heads' | 'tails',
                        bet.amount,
                    );
                    break;
                case 'slotmachine':
                case 'slotmachinedev':
                    payout = this.slotMachineService.calculatePayout(
                        result,
                        bet.amount,
                    );
                    break;
                case 'horserace':
                case 'horseracedev':
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
                    await this.txService.getTransactionTypeFromGame(gameName),
                );
            }

            resolvedBets.push(bet);
        }

        await this.roundService.finishRound(round.id, result);

        return {
            result,
            bets: resolvedBets,
            payout,
        };
    }
}
