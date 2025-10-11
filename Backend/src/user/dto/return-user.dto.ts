import { Expose, Type } from 'class-transformer';
import { Bet } from 'src/bet/entities/bet.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
export class ReturnUserDto {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  Credit: string;
  @Expose()
  freeSpin: string;

  @Expose()
  transactions: Transaction;

  @Expose()
  bets: Bet;
}
