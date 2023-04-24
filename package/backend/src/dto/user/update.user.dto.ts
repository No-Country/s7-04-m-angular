import { Expose, Exclude} from "class-transformer";
import { IsEmail, IsStrongPassword, MinLength, IsOptional, IsJWT } from "class-validator";

export class UpdateUserDTO {

    @Expose()
    id: number;
    
    @Expose()
    @IsOptional()
    nickname?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    email?: string;

    @Expose()
    @IsOptional()
    @IsStrongPassword()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @Expose()
    image?: string;

    @IsOptional()
    @Exclude()
    @IsJWT()
    token?: string;
    
    @IsOptional()
    @Expose()
    isValid?: boolean;
    
    @IsOptional()
    @Expose()
    roleId?: number;

 

}
