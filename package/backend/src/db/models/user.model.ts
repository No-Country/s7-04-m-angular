import { Table, Column, Model, Unique, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Role } from "./role.model";

@Table({ paranoid: true })
export class User extends Model<User> {
  @Unique
  @Column
  nickname: string;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Column
  image: string;

  @Column
  token: string;

  @Default(false)
  @Column
  isValid: boolean;

  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;
}
