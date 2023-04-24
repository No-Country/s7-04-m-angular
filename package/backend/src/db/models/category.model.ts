import { Table, Column, Model, HasMany, Unique } from "sequelize-typescript";
import { Thread } from "./thread.model";


@Table
export class Category extends Model<Category> {

    @Unique
    @Column
    name: string;

    @Column
    imageURL:string;

    @HasMany(() => Thread)
    threads: Thread[];

}
