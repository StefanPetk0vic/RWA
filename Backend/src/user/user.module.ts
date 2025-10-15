import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { AdminSeeder } from './admin.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtService, AdminSeeder],
  controllers: [UserController],
  exports: [UserService, AdminSeeder], // da AuthService može da koristi UserService
})
export class UserModule {}
