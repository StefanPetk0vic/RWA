import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies.jwt;
    if (!token) {
      throw new BadRequestException('no token sent!');
    }
    const games = await this.gameService.FindAll();
    return res.status(200).json(games);
  }
}
