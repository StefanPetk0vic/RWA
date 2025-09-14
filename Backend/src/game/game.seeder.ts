import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GameSeeder {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) {}
  async seed() {
    const games = [
      { name: 'Poker', enabled: false, developer: false },
      { name: 'Blackjack', enabled: false, developer: false },
      { name: 'Roulette', enabled: false, developer: false },
      { name: 'PokerDev', enabled: true, developer: true },
      { name: 'BlackjackDev', enabled: true, developer: true },
      { name: 'RouletteDev', enabled: true, developer: true },
    ];
    for (const g of games) {
      const exists = await this.gameRepo.findOne({ where: { name: g.name } });
      if (!exists) {
        await this.gameRepo.save(this.gameRepo.create(g));
      }
    }
  }
}
