import { Expose, Type} from "class-transformer";
import { TagSimpleDTO } from "../../tag/tag.simple.dto";
import { Tag } from "../../../db/models/tag.model";
import { IsEmpty, IsNotEmpty } from "class-validator";

export class ThreadCreateDTO {
    
    @Expose()
    @IsNotEmpty()
    title: string;
    @Expose()
    @IsNotEmpty()
    content: string;
    @Expose()
    @IsEmpty({message: "You can't set the user id."})
    userId: number;
    @Expose()
    @IsNotEmpty()
    categoryId: number;
    @Expose()
    @IsNotEmpty()
    tags: string[];
}