import { Controller, Post, Body, Param, Patch, Get, UseGuards, Req } from '@nestjs/common';
import { RoundService } from './round.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) { }


  @UseGuards(AuthGuard)
  @Post('start')
  async startRound(@Body() body: { gameId: number }, @Req() req) {
    const userId = req.user.sub;
    return this.roundService.startRound(body.gameId, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/finish')
  async finishRound(@Param('id') id: number, @Body() body: { result: string }) {
    return this.roundService.finishRound(id, body.result);
  }


  //TODO: filter out what rounds are needed.
  @UseGuards(AuthGuard)
  @Get('user')
  async getUserRounds(@Req() req) {
    const userId = req.user.sub;
    return this.roundService.getUserRounds(userId);
  }
}
