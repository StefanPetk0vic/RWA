import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BetModule } from './bet/bet.module';
import { TransactionModule } from './transaction/transaction.module';
import { GameModule } from './game/game.module';
import { RoundModule } from './round/round.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Game } from './game/entities/game.entity';
import { Bet } from './bet/entities/bet.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { Round } from './round/entities/round.entity';
import { DatabaseModule } from './database.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    BetModule,
    TransactionModule,
    GameModule,
    RoundModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User, Game, Bet, Transaction, Round]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
