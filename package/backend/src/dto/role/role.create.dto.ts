import { Expose } from 'class-transformer';

export class CreateRoleRequestDTO { 
    @Expose()
    name: string; 
}