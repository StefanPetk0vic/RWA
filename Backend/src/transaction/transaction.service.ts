import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Round } from 'src/round/entities/round.entity';
import { TransactionType } from './entities/transaction.entity';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    @InjectRepository(Transaction)
    private readonly userRepo: Repository<User>,
  ) { }

  async createTransaction(
    user: User,
    round: Round | null,
    credits: number,
    type: TransactionType,
  ) {
    const transaction = this.txRepo.create({
      user,
      round: round ?? undefined,
      credits,
      walletBalance: user.Credit,
      type,
    });

    return this.txRepo.save(transaction);
  }

  async createBetTransaction(user: User, round: Round, credits: number) {
    const type = this.getTransactionTypeFromGame(round.game.name);
    return this.createTransaction(user, round, credits, type);
  }

  private getTransactionTypeFromGame(gameName: string): TransactionType {
    switch (gameName.toLowerCase()) {
      case 'blackjack': return TransactionType.BLACKJACK;
      case 'gift': return TransactionType.GIFT;
      case 'slotmachine':
      case 'slots': return TransactionType.SLOTMACHINE;
      case 'horserace': return TransactionType.HORSERACE;
      default: throw new Error(`Unknown game type: ${gameName}`);
    }
  }

  async createGiftTransaction(sender: User, recipient: User, credits: number) {
    // Deduct from sender
    sender.Credit -= credits;
    await this.userRepo.save(sender);

    // Add to recipient
    recipient.Credit += credits;
    await this.userRepo.save(recipient);

    // Save trans for sender
    await this.createTransaction(sender, null, -credits, TransactionType.GIFT);

    // Save trans for recipient
    return this.createTransaction(recipient, null, credits, TransactionType.GIFT);
  }

  async getUserTransactions(userId: number) {
    return this.txRepo.find({
      where: { user: { id: userId } },
      relations: ['round', 'round.game'],
      order: { transactionAt: 'DESC' },
    });
  }

  async getTransactionById(id: number) {
    const tx = await this.txRepo.findOne({
      where: { id },
      relations: ['user', 'round', 'round.game'],
    });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }
}
