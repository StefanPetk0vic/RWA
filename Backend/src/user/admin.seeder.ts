import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class AdminSeeder {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async seed() {
    const users = [
      {
        email: 'admin@example.com',
        username: 'admin',
        firstName: 'admin',
        lastName: 'admin',
        password: '123456Pp!',
        permissions: UserRole.ADMIN,
      },
    ];

    for (const u of users) {
      const exists = await this.userRepo.findOne({ where: { email: u.email } });
      if (!exists) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto
          .createHash('sha256')
          .update(u.password + salt)
          .digest('hex');

        const userEntity = this.userRepo.create({
          ...u,
          password: hashedPassword,
          salt: salt,
        });

        await this.userRepo.save(userEntity);
        console.log(`Seeded admin user: ${u.email}`);
      }
    }
  }
}
