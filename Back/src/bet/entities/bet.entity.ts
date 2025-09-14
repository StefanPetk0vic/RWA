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

enum BetType {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
  REFUNDED = 'refunded',
}

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Round, (round) => round.bets)
  round: Round;

  @ManyToOne(() => User, (user) => user.bets)
  user: User;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: BetType,
    default: BetType.PENDING,
  })
  status: BetType;

  @Column()
  payout: number;

  @Column({ type: 'jsonb', nullable: true })
  prediction: any; // flexible JSON
}
