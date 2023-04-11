import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CategoryCreateDTO {

    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    description: string;


}