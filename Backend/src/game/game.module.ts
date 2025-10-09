import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameSeeder } from './game.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { SlotMachineService } from './logic/slot-machine.service';
import { HorseRaceService } from './logic/horse-race.service';
import { CoinFlipService } from './logic/coin-flip.service';
import { BlackjackService } from './logic/blackjack.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Game]),JwtModule],
  controllers: [GameController],
  providers: [GameService, GameSeeder, SlotMachineService,HorseRaceService,CoinFlipService,BlackjackService],
  exports: [GameSeeder,SlotMachineService,HorseRaceService,CoinFlipService,BlackjackService],
})
export class GameModule {}
