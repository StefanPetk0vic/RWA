import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { BetService } from './bet.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { BetType } from './entities/bet.entity';

@Controller('bets')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @UseGuards(AuthGuard)
  @Post()
  async placeBet(
    @Body() body: { roundId: number; amount: number; prediction: any },
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.betService.placeBet(
      userId,
      body.roundId,
      body.amount,
      body.prediction,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id/refund')
  async refundBet(@Param('id') id: number) {
    return this.betService.refundBet(id);
  }

  @UseGuards(AuthGuard)
  @Get('round/:roundId')
  async getBetsByRound(@Param('roundId') roundId: number) {
    return this.betService.getRoundBets(roundId);
  }
  @UseGuards(AuthGuard)
  @Get('All-Bets')
  async getAllBets(@Req() req) {
    return this.betService.getAllBets(req.user.sub);
  }
}
