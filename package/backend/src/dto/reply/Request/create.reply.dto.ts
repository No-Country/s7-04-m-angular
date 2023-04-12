import { IsNotEmpty } from 'class-validator';

export class CreateReplyDTO {
    
    @IsNotEmpty()
    body: string;
    @IsNotEmpty()
    threadId: number;
    @IsNotEmpty()
    userId: number;

}