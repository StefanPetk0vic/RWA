import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { GameService } from './game.service';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      return this.gameService.FindAll('guest');
    }
    return this.gameService.FindAll(user.permissions);
  }

  @UseGuards(AuthGuard)
  @Get('enabled-games')
  async getEnabledGames(@Req() req: Request) {
    const user = req.user;
    return this.gameService.getEnabledGames(user.permissions);
  }

  // Admin-only: create a new game
  @UseGuards(AuthGuard)
  @Post('admin/add')
  async addGame(
    @Req() req: Request,
    @Body() body: { name: string; developer?: boolean },
  ) {
    const user = req.user;
    if (user.permissions !== UserRole.ADMIN) {
      throw new BadRequestException('Only admins can add new games');
    }
    return this.gameService.addGame(body.name.toLowerCase(), !!body.developer);
  }

  // Admin-only: remove a game
  @UseGuards(AuthGuard)
  @Delete('admin/remove/:id')
  async removeGame(@Req() req: Request, @Param('id') id: number) {
    const user = req.user;
    if (user.permissions !== UserRole.ADMIN) {
      throw new BadRequestException('Only admins can remove games');
    }
    return this.gameService.removeGame(id);
  }

  // Admin + Developer: enable/disable a game
  @UseGuards(AuthGuard)
  @Patch('toggle/:id')
  async toggleGame(@Param('id') id: number) {
    return this.gameService.toggleGameState(id);
  }
}
