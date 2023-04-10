import { Expose } from "class-transformer";

export class TagDTO {
    @Expose()
    id: number;
    @Expose()
    name: string;
}