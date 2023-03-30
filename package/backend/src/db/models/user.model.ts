
import {Table , Column, Model, HasOne } from 'sequelize-typescript';


@Table
export class User extends Model<User> {
    
        @Column
        nickname:string;

        @Column
        email: string;
    
        @Column
        password: string;
    
}

