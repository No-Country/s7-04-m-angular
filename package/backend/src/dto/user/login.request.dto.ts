import { Expose } from 'class-transformer';

export class LoginUserDTO {
    @Expose()
    email: string;
    @Expose()
    password: string;

 
}