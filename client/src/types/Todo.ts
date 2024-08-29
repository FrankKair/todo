import { User } from "./User";
import { Board } from "./Board";

export interface Todo {
  readonly id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  readonly createdBy: User;
  readonly board: Board;
  lastUpdated: string;
}

export type TodoStatus = 'TODO' | 'ONGOING' | 'DONE';