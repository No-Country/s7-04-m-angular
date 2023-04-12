import { Expose, Exclude } from "class-transformer";

export class CreateUserDTO {

   
    @Expose()
    nickname: string;
    @Expose()
    email: string;
    @Expose()
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
