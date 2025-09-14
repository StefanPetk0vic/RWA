import { IsString, IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    AGENCY = 'agency',
    MOD = 'moderator',
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @IsString()
    lastName: string;
    @IsString()
    @IsNotEmpty()
    username: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    // @IsStrongPassword({
    //     minLength: 8,
    //     minLowercase: 1,
    //     minUppercase: 1,
    //     minNumbers: 1,
    //     minSymbols: 1,
    // })
    @IsNotEmpty()
    password: string;
    // @IsEnum(UserRole)
    // readonly permission: UserRole;
}
