import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GameSeeder {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) {}
  async seed() {
    const games = [
      { name: 'Poker', enabled: false },
      { name: 'Blackjack', enabled: false },
      { name: 'Roulette', enabled: false },
      { name: 'PokerDev', enabled: true },
      { name: 'BlackjackDev', enabled: true },
      { name: 'RouletteDev', enabled: true },
    ];
    for (const g of games) {
      const exists = await this.gameRepo.findOne({ where: { name: g.name } });
      if (!exists) {
        await this.gameRepo.save(this.gameRepo.create(g));
      }
    }
  }
}
