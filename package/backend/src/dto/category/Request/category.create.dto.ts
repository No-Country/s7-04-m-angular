import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CategoryCreateDTO {

    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string;


    @IsOptional()
    @IsString()
    @Expose()
    imageURL: string;

}