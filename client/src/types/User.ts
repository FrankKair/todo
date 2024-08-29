import { Board } from './Board';

export interface User {
  readonly id: string;
  readonly createdAt: Date;
  readonly username: string;
  boards?: Board[];
}