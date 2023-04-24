import { Table,Model, ForeignKey, Column } from "sequelize-typescript";
import { Thread } from "./thread.model";
import { Reply } from "./reply.model";


@Table
export class ReplyThread extends Model<ReplyThread> {

    @ForeignKey(() => Thread)
    @Column
    threadId: number;
    
    @ForeignKey(() => Reply)
    @Column
    replyId: number;

}

