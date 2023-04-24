import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user.model";
import { Thread } from "./thread.model";

@Table({ paranoid: true })
export class Reply extends Model<Reply> {
  
  @Column
  body: string;

  @Column
  votes: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Thread)
  @Column
  threadId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Thread)
  thread: Thread;

}
