import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable
} from 'typeorm';
import { User } from './User';
import { Todo } from './Todo';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  name!: string;

  @ManyToOne(() => User)
  owner!: User;

  @OneToMany(() => Todo, (todo) => todo.board)
  todos!: Todo[];

  // Users who have access to the board (including the owner)
  @ManyToMany(() => User, (user) => user.boards)
  @JoinTable()
  users!: User[];

  @Column({ unique: true })
  shareKey!: string;
}