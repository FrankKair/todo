import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany
} from 'typeorm';
import { Length } from 'class-validator';
import { Board } from './Board';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @Length(4, 20)
  username!: string;

  @Column()
  @Length(4, 20)
  password!: string;

  @ManyToMany(() => Board, (board) => board.users)
  boards!: Board[];
}