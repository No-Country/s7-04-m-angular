import { IsStrongPassword ,MinLength} from "class-validator";
import { Expose } from "class-transformer";

export class ChangePassDTO {
   
    @Expose()
    @MinLength(8)
    @IsStrongPassword()
    password: string;

    @Expose()
    token: string;
   
}