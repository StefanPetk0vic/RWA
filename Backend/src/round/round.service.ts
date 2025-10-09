import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from './entities/round.entity';
import { Game } from 'src/game/entities/game.entity';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private readonly roundRepo: Repository<Round>,
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ) {}

  async startRound(gameId: number, userId: number) {
    const game = await this.gameRepo.findOne({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Game not found');
    if(!game.enabled) throw new BadRequestException('Game is currently down')

    const round = this.roundRepo.create({
      game,
      status: 'pending',
    });

    return this.roundRepo.save(round);
  }

  async getUserRounds(userId: number) {
    return this.roundRepo
      .createQueryBuilder('round')
      .leftJoinAndSelect('round.bets', 'bet')
      .leftJoinAndSelect('round.game', 'game')
      .where('bet.user.id = :userId', { userId })
      .getMany();
  }

  async findOne(roundId: number){
    return this.roundRepo.findOne({where:{id:roundId}});
  }

  //Useless now
  async finishRound(roundId: number, result: string) {
    const round = await this.roundRepo.findOne({ where: { id: roundId } });
    if (!round) throw new NotFoundException('Round not found');

    round.result = result;
    round.status = 'finished';
    return this.roundRepo.save(round);
  }
}
