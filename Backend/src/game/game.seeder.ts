import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GameSeeder {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) { }
  async seed() {
    const games = [
      { name: 'poker', enabled: false, developer: false },
      { name: 'blackjack', enabled: false, developer: false },
      { name: 'MineField', enabled: false, developer: false },
      { name: 'CoinFlip', enabled: false, developer: false },
      { name: 'HorseRace', enabled: false, developer: false },

      { name: 'pokerDev', enabled: false, developer: true },
      { name: 'blackjackDev', enabled: true, developer: true },
      { name: 'minefieldDev', enabled: true, developer: true },
      { name: 'coinflipDev', enabled: true, developer: true },
      { name: 'horseraceDev', enabled: true, developer: true },

    ];
    for (const g of games) {
      const exists = await this.gameRepo.findOne({ where: { name: g.name } });
      if (!exists) {
        await this.gameRepo.save(this.gameRepo.create(g));
      }
    }
  }
}
