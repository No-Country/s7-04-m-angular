import { Table, Column, Model, HasOne, Unique, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Role } from "./role.model";

@Table
export class User extends Model<User> {
  @Unique
  @Column
  nickname: string;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Default("")
  @Column
  token: string;

  @Default(true)
  @Column
  isValid: boolean;

  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;
}
