import { Expose, Exclude, Type } from "class-transformer";
import { RoleDTO } from "../role/role.dto";

export class UserDTO {

    @Expose()
    id: number;
    @Expose()
    nickname: string;
    @Expose()
    email: string;
    @Expose()
    image: string;
    @Expose()
    isValid: boolean;
    @Expose()
    roleId: number;
    @Expose()
    @Type(() => RoleDTO)
    role: RoleDTO;
 

}
