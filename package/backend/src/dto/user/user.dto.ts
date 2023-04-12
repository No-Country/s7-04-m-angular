import { Expose, Exclude } from "class-transformer";

export class UserDTO {

    @Expose()
    id: number;
    @Expose()
    nickname: string;
    @Expose()
    email: string;
    @Exclude()
    password: string;
    @Expose()
    image: string;
    @Exclude()
    token: string;
    @Expose()
    isValid: boolean;
    @Expose()
    roleId: number;

 

}
