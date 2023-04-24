import { Expose } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDTO {
    
    @Expose()
    @IsEmail()
    email: string;
    
    @Expose()
    @MinLength(8)
    password: string;


}