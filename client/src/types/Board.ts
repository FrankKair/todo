import { User } from './User';
import { Todo } from './Todo';

export interface Board {
  readonly id: string;
  createdAt: Date;
  readonly name: string;
  readonly owner: User;
  todos?: Todo[];
  readonly shareKey: string;
}