import {
  Controller,
  Get,
  Query,
  Patch,
  UseGuards,
  BadRequestException,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('by-email')
  async findByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) return user;
    return { msg: 'User not found' };
  }

  @Get('by-id')
  async findById(@Query('id') id: number) {
    const user = await this.userService.findUserById(id);
    if (user) return user;
    return { msg: 'User not found' };
  }

  @Get('by-username')
  async findByUsername(@Query('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    if (user) return user;
    return { msg: 'User not found' };
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateProfile(@Req() req: Request, @Res() res: Response) {
    const data = plainToInstance(UpdateUserDto, req.body);
    if (!data) {
      throw new BadRequestException('no data sent!');
    }
    const token = req.cookies.jwt;
    if (!token) {
      throw new BadRequestException('no token sent!');
    }
    await this.userService.updateUser(data, token);
    return res.status(200).json({ message: 'User updated successfully' });
  }

  @UseGuards(AuthGuard)
  @Get('me/balance')
  async getBalance(@Req() req: Request) {
    const token = req.cookies.jwt;
    if (!token) throw new BadRequestException('No token sent!');
    return await this.userService.getBalance(token);
  }

  //Get all bets of logged-in user
  @UseGuards(AuthGuard)
  @Get('me/bets')
  async getMyBets(@Req() req: Request) {
    const token = req.cookies.jwt;
    if (!token) throw new BadRequestException('No token sent!');
    return this.userService.getUserBets(token);
  }

  //Get transaction history
  @UseGuards(AuthGuard)
  @Get('me/transactions')
  async getMyTransactions(@Req() req: Request) {
    const token = req.cookies.jwt;
    if (!token) throw new BadRequestException('No token sent!');
    return this.userService.getUserTransactions(token);
  }

  @Get()
  Test(@Req() request: Request) {
    console.log(request.cookies);
  }
}
