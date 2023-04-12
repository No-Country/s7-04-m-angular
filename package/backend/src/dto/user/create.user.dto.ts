import { Expose, Exclude } from "class-transformer";
import { IsEmail, IsOptional, IsStrongPassword } from "class-validator";

export class CreateUserDTO {

   
    @Expose()
    nickname: string;
    @IsEmail()
    @Expose()
    email: string;

    
    @Expose()
    @IsStrongPassword()
    password: string;

    @IsOptional()
    @Expose()
    image?: string;

    @IsOptional()
    @Exclude()
    token?: string;

    @Expose()
    isValid: boolean;
    @Expose()
    roleId: number;

}
