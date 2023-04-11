import { Expose, Type} from "class-transformer";
import { TagDTO } from "../tag/tag.dto";

export class CreateThreadDTO {
    
    @Expose()
    title: string;
    @Expose()
    content: string;
    @Expose()
    userId: number;
    @Expose()
    categoryId: number;
    @Expose()
    @Type(() => TagDTO)
    tags: TagDTO[];
}