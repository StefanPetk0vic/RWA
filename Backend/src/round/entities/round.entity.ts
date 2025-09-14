import { Bet } from 'src/bet/entities/bet.entity';
import { Game } from 'src/game/entities/game.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  result: string; //Horse#1 or dealerBlackJack or playerBlackJack

  @Column({ default: 'pending' })
  status: string; //pending or finished

  @CreateDateColumn()
  startedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.round)
  transactions: Transaction[];

  @ManyToOne(() => Game, (game) => game.rounds)
  game: Game;

  @OneToMany(() => Bet, (bet) => bet.round)
  bets: Bet[];
}
