import { IPaginated } from '../../../interfaces/IPaginated';
import { ReplyDTO } from '../reply.dto';
import { Expose, Type } from 'class-transformer';


export class RepliesPaginatedDTO implements IPaginated<ReplyDTO>{
    
    @Expose()
    @Type(() => ReplyDTO)
    data: ReplyDTO[];
    @Expose()
    lastPage: number;
    @Expose()
    totalRecords: number;
    @Expose()
    currentPage: number;
    @Expose()
    hasMorePages: boolean;

}