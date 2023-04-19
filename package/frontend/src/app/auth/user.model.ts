export interface User {
  id: number;
  nickname: string;
  email: string;
  password: string;
  expiresIn: number;
  token: string;
}
