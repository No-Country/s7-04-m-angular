import { Table,Model, ForeignKey, Column } from "sequelize-typescript";
import { Thread } from "./thread.model";
import { Tag } from "./tag.model";


@Table
export class ThreadTag extends Model<ThreadTag> {

    @ForeignKey(() => Thread)
    @Column
    threadId: number;
    
    @ForeignKey(() => Tag)
    @Column
    tagId: number;

}

