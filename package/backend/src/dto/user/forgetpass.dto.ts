import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class ForgetPassDTO {
    @Expose()
    @IsEmail()
    email: string;
}