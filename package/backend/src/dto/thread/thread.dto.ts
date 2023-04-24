import { TagDTO } from '../tag/tag.dto';
import { CategoryDTO } from '../category/category.dto';
import { UserDTO } from '../user/user.dto';
import { ReplyDTO } from '../reply/reply.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Tag } from '../../db/models/tag.model';


export class ThreadDTO {
    @Expose()
    id: number;
    @Expose()
    title: string;
    @Expose()
    content: string;

    @Expose()
    @Type(() => CategoryDTO)
    category: CategoryDTO;
    
    @Expose()
    @Type(() => UserDTO)
    user: UserDTO;

    @Expose()
    @Type(() => TagDTO)
    @Transform(({ value }) => value.map(tag => tag.name))
    tags: string[];

    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

}