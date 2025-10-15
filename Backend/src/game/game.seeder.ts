import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GameSeeder {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) {}
  async seed() {
    const games = [
      //{ name: 'poker', enabled: false, developer: false },
      //{ name: 'blackjack', enabled: false, developer: false },
      { name: 'slotmachine', enabled: true, developer: false },
      { name: 'coinflip', enabled: true, developer: false },
      { name: 'horserace', enabled: true, developer: false },

      //{ name: 'pokerDev', enabled: false, developer: true },
      //{ name: 'blackjackDev', enabled: true, developer: true },
      { name: 'slotmachineDev', enabled: true, developer: true },
      { name: 'coinflipDev', enabled: true, developer: true },
      { name: 'horseraceDev', enabled: true, developer: true },
    ];
    console.log('GAME SEEDER EXISTS');
    for (const g of games) {
      const exists = await this.gameRepo.findOne({ where: { name: g.name } });
      if (!exists) {
        await this.gameRepo.save(this.gameRepo.create(g));
        console.log('GAME SEEDER  !EXISTS ');
      }
    }
  }
}
