import { Expose } from "class-transformer";

export class TagCreateDTO {
    @Expose()
    name: string;
}