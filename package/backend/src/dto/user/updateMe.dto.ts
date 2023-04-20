import { Expose, Exclude} from "class-transformer";
import { IsEmail, IsStrongPassword, MinLength, IsOptional, IsJWT } from "class-validator";

export class UpdateMeDTO {

    @Expose()
    id: number;
    
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


}
