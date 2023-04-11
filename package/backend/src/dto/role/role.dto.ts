import { Expose } from "class-transformer";

export class RoleDTO {
    @Expose()
    id: number;
    @Expose()
    name: string;
}