import { Round } from 'src/round/entities/round.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export enum TransactionType {
  GIFT = 'gift',
  BLACKJACK = 'blackjack',
  SLOTMACHINE = 'slotmachine',
  HORSERACE = 'horserace',
  COINFLIP = 'coinflip',
}


@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  credits: number;

  @Column()
  walletBalance: number;

  @CreateDateColumn()
  transactionAt: Date;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => Round, (round) => round.transactions)
  round: Round;
}
