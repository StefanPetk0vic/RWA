import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Follow } from './follow.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Bet } from 'src/bet/entities/bet.entity';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  permissions: UserRole;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 1000 })
  Credit: number;

  @Column({ default: 5 })
  freeSpin: number;

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: User[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: User[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[];
}
