import { Table, Column, Model, Unique, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { Tag } from "./tag.model";
import { ThreadTag } from "./threadTag.model";
import { User } from "./user.model";
import { Category } from "./category.model";

@Table({ paranoid: true })
export class Thread extends Model<Thread> {
    
    @Column
    title: string;

    @Column
    content: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(()=>Category)
    @Column
    categoryId: number;

    @BelongsToMany(() => Tag, () => ThreadTag)
    tags: Tag[];
    
    @BelongsTo(() => User)
    user: User;
}