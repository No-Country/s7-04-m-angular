import { Table, Column, Model, HasOne, Unique, Default } from "sequelize-typescript";

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
}
