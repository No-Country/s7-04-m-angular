import { Model } from 'sequelize-typescript';
export declare class User extends Model<User> {
    nickname: string;
    email: string;
    password: string;
}
