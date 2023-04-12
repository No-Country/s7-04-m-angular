import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CategoryDTO {

    @IsNotEmpty()
    @Expose()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string;


}