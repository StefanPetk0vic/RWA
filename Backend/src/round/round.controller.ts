import { Controller, Post, Body, Param, Patch, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { RoundService } from './round.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoundResolver } from './logic/round-resolver.service';

@UseGuards(AuthGuard)
@Controller('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService,
    private readonly roundResolver: RoundResolver,
  ) { }

  @Post('start')
  async startRound(@Body() body: { gameId: number }, @Req() req) {
    const userId = req.user.sub;
    return this.roundService.startRound(body.gameId, userId);
  }

  @Post(':roundId/resolve')
  async resolveRound(@Param('roundId') roundId: number) {
    const round = await this.roundService.findOne(roundId);
    if (!round) {
      throw new BadRequestException('Round not found');
    }
    return this.roundResolver.resolveRound(round);
  }

  @Get('user')
  async getUserRounds(@Req() req) {
    const userId = req.user.sub;
    return this.roundService.getUserRounds(userId);
  }

  //Useless now
  @Patch(':id/finish')
  async finishRound(@Param('id') id: number, @Body() body: { result: string }) {
    return this.roundService.finishRound(id, body.result);
  }
}
