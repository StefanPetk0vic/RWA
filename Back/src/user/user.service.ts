import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthJwtPayload } from 'src/auth/types/auth-jwtPayload';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ReturnUserDto } from './dto/return-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    console.log('User.service.ts entity before save:', user);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: ILike(email) } });
  }

  findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateUser(dto: UpdateUserDto, token: string) {
    const decodedJwtAccessToken: AuthJwtPayload = this.jwtService.decode(token);

    const user = await this.findUserById(decodedJwtAccessToken.sub);
    if (!user) throw new NotFoundException('User not found!');

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async GetUser(email: string): Promise<ReturnUserDto | null>;
  async GetUser(id: number): Promise<ReturnUserDto | null>;
  async GetUser(param: string | number): Promise<ReturnUserDto | null> {
    let user;
    if (typeof param === 'string') {
      user = await this.userRepository.findOne({
        where: { email: param },
      });
    } else {
      user = await this.userRepository.findOne({
        where: { id: param },
      });
    }
    return plainToInstance(ReturnUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
  //Mozemo na dva nacina: Forgot password i update logged in
  //  updatePassword(JWT nam treba i update-password.dto.ts object) {
  //  this.currUser.password =  password ;
  //  }

  //Update preko JWT i updateUser.dto
  //  updateAge() {
  //  }

  //Update preko JWT i updateUser.dto i plus ako radimo email verifikaciju
  //mora da klikne link
  updateEmail(JWT: AuthJwtPayload, newEmail: string) {}
}
