import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) { }
  async FindAll(userPermission: 'admin' | 'developer' | 'user') {
    const games = await this.gameRepository.find();

    return games.filter(game => {
      // Admin and developer can see all games
      if (userPermission === 'admin' || userPermission === 'developer') return true;

      // Regular users only see non-dev games
      if (userPermission === 'user' && !game.developer) return true;

      return false;
    });
  }

  // Get only enabled games visible to a user
  async getEnabledGames(userPermission: 'admin' | 'developer' | 'user'): Promise<Game[]> {
    const games = await this.gameRepository.find({ where: { enabled: true } });

    return games.filter(game => {
      if (userPermission === 'admin' || userPermission === 'developer') return true;
      if (userPermission === 'user' && !game.developer) return true;
      return false;
    });
  }


  async addGame(name: string, developer: boolean = false): Promise<Game> {
    const game = this.gameRepository.create({ name, enabled: true, developer });
    return this.gameRepository.save(game);
  }

  async removeGame(id: number): Promise<{ message: string }> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    await this.gameRepository.remove(game);
    return { message: `Game ${game.name} removed successfully` };
  }

  async toggleGameState(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    game.enabled = !game.enabled;
    return this.gameRepository.save(game);
}


  async getEnabledGamesForUser(userRole: string): Promise<Game[]> {
    // Only show developerOnly games if user is admin/developer
    const query = this.gameRepository.createQueryBuilder('game').where('game.enabled = :enabled', { enabled: true });
    if (![UserRole.ADMIN, UserRole.DEVELOPER].includes(userRole as UserRole)) {
      query.andWhere('game.developerOnly = false');
    }
    return query.getMany();
  }



}
