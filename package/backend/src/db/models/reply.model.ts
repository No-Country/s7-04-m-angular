import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ paranoid: true })
export class Reply extends Model<Reply> {
  
  @Column
  body: string;

  @Column
  votes: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

}
