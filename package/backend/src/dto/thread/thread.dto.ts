import { TagDTO } from '../tag/tag.dto';
import { CategoryDTO } from '../category/category.dto';
import { UserDTO } from '../user/user.dto';
import { ReplyDTO } from '../reply/reply.dto';
import { Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';


export class ThreadDTO {
    @Expose()
    id: number;
    @Expose()
    title: string;
    @Expose()
    content: string;
    @Expose()
    userId: number;
    @Expose()
    categoryId: number;
    @Expose()
    @IsOptional()
    @Type(() => TagDTO)
    tags: TagDTO[];
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;
  
}