import { forwardRef,Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';
import { BetService } from './bet.service';
import { BetController } from './bet.controller';
import { UserModule } from 'src/user/user.module';
import { RoundModule } from 'src/round/round.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { Round } from 'src/round/entities/round.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet,Round,User]),
    UserModule,
    forwardRef(() => RoundModule),
    AuthModule,
    TransactionModule,
  ],
  controllers: [BetController],
  providers: [BetService],
  exports: [BetService],
})
export class BetModule {}
