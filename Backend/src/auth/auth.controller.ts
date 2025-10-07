import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './guard/auth.guard';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const token = await this.authService.register(createUserDto);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // or 'lax'
        maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
      });

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Registration failed' });
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const token = await this.authService.login(loginUserDto);
    console.log('Login');

    const returnUser = await this.userService.GetUser(loginUserDto.email);
    if (!returnUser) {
      throw new BadRequestException('User not found');
    }
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax', // or 'lax'
      maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
    });
    return res
      .status(201)
      .json({ message: 'User registered successfully'});
  }

  //passthrough sluzi da ne moramo da saljemo .json .send nazad
  //vec mozemo samo da zamenimo sta nam treba i da saljemo nazad
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('check')
  isLoginIn(@Req() req) {
    return { user: req.user };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    console.log(req.user);
    return req.user; //vraca sve i iat i exp, ako zelim samo id u email pise {sub : req.user.id, email..., ali nmg username jer nije u tokenu }
  }
}
