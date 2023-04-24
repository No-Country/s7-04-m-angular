import { Expose, Exclude, Type } from "class-transformer";
import { RoleDTO } from "../role/role.dto";

export class UserSimpleDTO {

    @Expose()
    id: number;
    @Expose()
    nickname: string;
    @Expose()
    @Type(() => RoleDTO)
    role: RoleDTO;
 

}
