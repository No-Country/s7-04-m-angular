import { Expose } from "class-transformer";

export class UserCreatedDTO {

    @Expose()
    id: string;
    @Expose()
    nickname: string;
    @Expose()
    email: string;

}