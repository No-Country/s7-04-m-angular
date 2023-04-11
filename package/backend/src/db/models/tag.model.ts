import { Table, Column, Model, Unique, BelongsToMany } from 'sequelize-typescript';
import { Thread } from './thread.model';
import { ThreadTag } from './threadTag.model';

@Table
export class Tag extends Model<Tag> {
    @Unique
    @Column
    name: string;

    @BelongsToMany(() => Thread, () => ThreadTag)
    threads: Thread[];
}