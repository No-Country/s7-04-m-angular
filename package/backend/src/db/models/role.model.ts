import { Table, Column, Model, Unique, HasMany } from "sequelize-typescript";
import { User } from "./user.model";

@Table
export class Role extends Model<Role> {
  @Unique
  @Column
  name: string;

  @HasMany(() => User)
  users: User[];
}
