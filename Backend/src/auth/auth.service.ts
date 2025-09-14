import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  Req,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PasswordService } from './auth.passwd';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email.toLowerCase(),
    );
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      throw new BadRequestException('User with this email already exists.');
    }
    const salt = this.passwordService.generateSalt();
    const hashedPassword = this.passwordService.hashPassword(
      createUserDto.password,
      salt,
    );
    const newUserDto = {
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      salt,
    };
    const newUser = await this.userService.create(newUserDto);
    console.log('User created:', newUser);
    const payload: AuthJwtPayload = { sub: newUser.id, email: newUser.email };
    return this.jwtService.sign(payload);
  }

  async login(loginUserDto: LoginUserDto) {
    // let email: string = loginUserDto.email.toLowerCase();
    const existingUser = await this.userService.findByEmail(loginUserDto.email);

    if (!existingUser) {
      throw new BadRequestException('Check if email or password is incorrect.');
    }

    if (
      this.passwordService.comparePasswords(
        loginUserDto.password,
        existingUser.salt,
        existingUser.password,
      )
    ) {
      //ovde i gore moze da se prosledi valjda username isto, ali mora da se promeni i u AuthJwtPayload, tj da se doda username ako kroz token ocu da saljem jos nesto
      const payload: AuthJwtPayload = {
        sub: existingUser.id,
        email: existingUser.email,
      };
      return this.jwtService.sign(payload);
    } else {
      throw new BadRequestException('password is incorrect');
    }
  }

  //#region TEST PODACI
  emails = [
    'marko@example.com',
    'jovana.petrovic@gmail.com',
    'nikola.nikolic@yahoo.com',
    'ana.savic@outlook.com',
    'lazar.m@gmail.com',
  ];
  passwords = ['123456Pp!', '123456Pp!', '123456Pp!', '123456Pp!', '123456Pp!'];
  firstnames = ['Marko', 'Jovana', 'Nikola', 'Ana', 'Lazar'];
  lastnames = ['Marković', 'Petrović', 'Nikolić', 'Savić', 'Milenković'];
  usernames = ['marko123', 'jovana_p', 'nikola.n', 'anaS', 'lazarM'];

  async onModuleInit() {
    const shouldSeed =
      this.configService.get<string>('SEED_TEST_USERS', 'false') === 'true';
    if (!shouldSeed) {
      console.log('Seed korisnika isključen preko .env.');
      return;
    }

    await this.seedUsersIfNeeded();
  }

  private async seedUsersIfNeeded() {
    const existing = await this.userService.findByEmail(this.emails[0]);
    if (existing) {
      console.log('Test korisnici već postoje. Seed se preskače.');
      return;
    }

    for (let i = 0; i < this.emails.length; i++) {
      await this.register({
        email: this.emails[i],
        password: this.passwords[i],
        firstName: this.firstnames[i],
        lastName: this.lastnames[i],
        username: this.usernames[i],
      });
    }
  }

  //#endregion
}
