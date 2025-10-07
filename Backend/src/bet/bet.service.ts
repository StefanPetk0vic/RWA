import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from './entities/bet.entity';
import { Round } from 'src/round/entities/round.entity';
import { User } from 'src/user/entities/user.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { BetType } from './entities/bet.entity';
import { TransactionType } from 'src/transaction/entities/transaction.entity';
@Injectable()
export class BetService {
    constructor(
        @InjectRepository(Bet)
        private readonly betRepo: Repository<Bet>,
        @InjectRepository(Round)
        private readonly roundRepo: Repository<Round>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly transactionService: TransactionService,
    ) { }

    async placeBet(userId: number, roundId: number, amount: number, prediction: any) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');
        if (user.Credit < amount) throw new BadRequestException('Insufficient Credit');

        const round = await this.roundRepo.findOne({
            where: { id: roundId },
            relations: ['game'],
        });
        if (!round) throw new BadRequestException('Round not found');

        // Deduct credits
        user.Credit -= amount;
        await this.userRepo.save(user);

        // Create a transaction for the bet placement
        const gameName = round.game.name.toLowerCase();
        let type: TransactionType;

        switch (gameName) {
            case 'blackjack':
                type = TransactionType.BLACKJACK;
                break;
            case 'slotmachine':
            case 'slots':
                type = TransactionType.SLOTMACHINE;
                break;
            case 'horserace':
                type = TransactionType.HORSERACE;
                break;
            default:
                type = TransactionType.GIFT; // fallback or misc
        }

        await this.transactionService.createTransaction(
            user,
            round,
            -amount,
            type,
        );

        const bet = this.betRepo.create({
            user,
            round,
            amount,
            prediction,
            status: BetType.PENDING,
            payout: 0,
        });

        return this.betRepo.save(bet);
    }


    async settleBet(id: number, status: BetType, payout: number) {
        const bet = await this.betRepo.findOne({ where: { id }, relations: ['user'] });
        if (!bet) throw new NotFoundException('Bet not found');

        bet.status = status;
        bet.payout = payout;

        if (status === BetType.WON || status === BetType.REFUNDED) {
            bet.user.Credit += payout;
            await this.userRepo.save(bet.user);
        }

        return this.betRepo.save(bet);
    }
    async refundBet(id: number) {
        const bet = await this.betRepo.findOne({ where: { id } });
        if (!bet) throw new NotFoundException('Bet not found');
        return this.settleBet(id, BetType.REFUNDED, bet.amount);
    }

    async getRoundBets(roundId: number) {
        return this.betRepo.find({
            where: { round: { id: roundId } },
            relations: ['user'],
        });
    }
}
