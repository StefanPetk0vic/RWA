import { Expose, Type } from 'class-transformer';
export class ReturnUserDto {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
}
