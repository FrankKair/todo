import { AppDataSource } from '../data-source';
import { Board, Todo, TodoStatus } from '../entities';
import { UserService } from './UserService';

export class TodoService {
  private todoRepository = AppDataSource.getRepository(Todo);
  private boardRepository = AppDataSource.getRepository(Board);

  async findById(id: string) {
    return this.todoRepository.findOne({
      where: { id },
      relations: ['board', 'createdBy'],
    });
  }

  async createTodo(todoName: string, userId: string, boardId: string) {
    const board = await this.boardRepository.findOneBy({ id: boardId });
    if (!board) throw new Error('Board not found');

    const userService = new UserService();
    const user = await userService.findById(userId);
    if (!user) throw new Error('User not found');

    const todo = this.todoRepository.create({
      title: todoName,
      createdBy: user,
      board,
    });

    return this.todoRepository.save(todo);
  }

  async updateTodoStatus(todoId: string, newStatus: TodoStatus): Promise<Todo> {
    const todo = await this.findById(todoId);
    if (!todo) throw new Error('Todo not found');

    const validTransitions = {
      TODO: ['ONGOING'],
      ONGOING: ['DONE', 'TODO'],
      DONE: ['ONGOING'],
    };

    if (!validTransitions[todo.status].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${todo.status} to ${newStatus}`);
    }

    todo.status = newStatus;
    todo.lastUpdated = new Date();
    return this.todoRepository.save(todo);
  }
}