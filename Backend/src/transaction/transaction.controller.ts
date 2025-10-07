import { Controller, Get, Param, UseGuards, Req, Post, Body, BadRequestException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('transactions')
@UseGuards(AuthGuard) // All routes require authentication
export class TransactionController {
  constructor(private readonly transactionService: TransactionService, private readonly userService: UserService) { }

  // Get all transactions of the logged-in user
  @Get('me')
  async getMyTransactions(@Req() req: Request) {
    const userId = req.user['id']; // injected by AuthGuard
    return this.transactionService.getUserTransactions(userId);
  }

  // Get a single transaction by id
  @Get(':id')
  async getTransaction(@Param('id') id: number, @Req() req: Request) {
    const tx = await this.transactionService.getTransactionById(id);

    // Optional security check: only allow the user to access their own transaction
    if (tx.user.id !== req.user['id']) {
      throw new Error('Unauthorized');
    }

    return tx;
  }

  @Post('gift')
  async sendGift(
    @Req() req: Request,
    @Body() body: { recipientUsername: string; amount: number },
  ) {
    const senderId = req.user['id'];

    const sender = await this.userService.findUserById(senderId);
    if (!sender) throw new BadRequestException('Sender not found');

    const recipient = await this.userService.findUserByUsername(body.recipientUsername);
    if (!recipient) throw new BadRequestException('Recipient not found');

    if (sender.id === recipient.id)
      throw new BadRequestException('Cannot send gift to yourself');

    if (sender.Credit < body.amount)
      throw new BadRequestException('Insufficient credit');

    return this.transactionService.createGiftTransaction(sender, recipient, body.amount);
  }

}
