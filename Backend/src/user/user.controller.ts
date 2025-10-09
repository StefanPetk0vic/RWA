import {
  Controller,
  Get,
  Query,
  Patch,
  UseGuards,
  BadRequestException,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
  @Patch('me')
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(req.user.sub, dto);
  }


  @UseGuards(AuthGuard)
  @Get('me/balance')
  async getBalance(@Req() req: any) {
    return this.userService.getBalance(req.user.sub);
  }



  //Get all bets of logged-in user
  @UseGuards(AuthGuard)
  @Get('me/bets')
  async getMyBets(@Req() req: any) {
    const userId = req.user.sub; // number
    return this.userService.getUserBets(userId);
  }


  @Get()
  Test(@Req() request: Request) {
    console.log(request.cookies);
  }
}
