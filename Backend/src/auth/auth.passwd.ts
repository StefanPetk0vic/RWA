import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
    hashPassword(password: string, salt: string): string {
        return crypto
            .createHash('sha256')
            .update(password + salt)
            .digest('hex');
    }

    comparePasswords(plainPassword: string, salt: string, hashedPassword: string): boolean {
        const hash = this.hashPassword(plainPassword, salt);
        return hash === hashedPassword;
    }

    generateSalt(length = 16): string {
        return crypto.randomBytes(length).toString('hex');
    }
}
