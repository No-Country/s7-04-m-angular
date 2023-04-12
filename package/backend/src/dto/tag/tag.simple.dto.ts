import { Expose } from "class-transformer";

export class TagSimpleDTO {
    @Expose()
    name: string;
}