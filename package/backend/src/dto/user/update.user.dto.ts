import { Expose, Exclude} from "class-transformer";

export class UpdateUserDTO {

    @Expose()
    id: number;
    @Expose()
    nickname?: string;
    @Expose()
    password?: string;
    @Expose()
    image?: string;
    @Exclude()
    token?: string;
    @Expose()
    isValid?: boolean;
    @Expose()
    roleId?: number;

 

}
