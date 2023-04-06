import { Expose } from "class-transformer";

export class RegisterUserDTO {

    @Expose()
    nickname: string;
    @Expose()
    email: string;
    @Expose()
    password: string;

  

}