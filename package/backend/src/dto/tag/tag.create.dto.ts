import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, ValidateIf} from "class-validator";



export class TagCreateDTO {
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;
}