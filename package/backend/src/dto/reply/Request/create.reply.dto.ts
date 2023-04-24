import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateReplyDTO {
    
    @IsNotEmpty()
    @Expose()
    body: string;
    @IsNotEmpty()
    @Expose()
    threadId: number;

}