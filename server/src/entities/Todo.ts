import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { User } from './User';
import { Board } from './Board';

export enum TodoStatus {
  TODO = 'TODO',
  ONGOING = 'ONGOING',
  DONE = 'DONE',
}

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description: string = '';

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.TODO,
  })
  status: TodoStatus = TodoStatus.TODO;

  @ManyToOne(() => User)
  createdBy!: User;

  @ManyToOne(() => Board, (board) => board.todos, { onDelete: 'CASCADE' })
  board!: Board;

  @CreateDateColumn()
  lastUpdated!: Date;
}
