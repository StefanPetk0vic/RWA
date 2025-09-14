export interface CreateUser {
  id: number;
  createDate: Date;
  updateDate: Date;

  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}
