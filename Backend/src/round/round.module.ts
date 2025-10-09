import { forwardRef,Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { Game } from 'src/game/entities/game.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RoundResolver } from './logic/round-resolver.service';
import { GameModule } from 'src/game/game.module';
import { BetModule } from 'src/bet/bet.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Round,Game]),AuthModule,GameModule,forwardRef(() => BetModule),forwardRef(() => TransactionModule)],
  controllers: [RoundController],
  providers: [RoundService,RoundResolver],
  exports: [RoundService,RoundResolver],
})
export class RoundModule {}
