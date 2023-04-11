import { IPaginated } from '../../interfaces/IPaginated';
import { UserDTO } from './user.dto';
import { Expose, Type } from 'class-transformer';


export class UsersPaginatedDTO implements IPaginated<UserDTO>{
    @Expose()
    @Type(() => UserDTO)
    data: UserDTO[];
    @Expose()
    lastPage: number;
    @Expose()
    totalRecords: number;
    @Expose()
    currentPage: number;
    @Expose()
    hasMorePages: boolean;

}