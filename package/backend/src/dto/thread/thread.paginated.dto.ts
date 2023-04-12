import { IPaginated } from '../../interfaces/IPaginated';
import { ThreadDTO } from './thread.dto';
import { Expose, Type } from 'class-transformer';


export class ThreadPaginatedDTO implements IPaginated<ThreadDTO>{
    
    @Expose()
    @Type(() => ThreadDTO)
    data: ThreadDTO[];
    @Expose()
    lastPage: number;
    @Expose()
    totalRecords: number;
    @Expose()
    currentPage: number;
    @Expose()
    hasMorePages: boolean;

}