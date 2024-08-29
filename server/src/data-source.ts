import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Board, Todo } from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'todo_db',
  synchronize: true,
  logging: true,
  entities: [User, Todo, Board],
  subscribers: [],
  migrations: [],
});
