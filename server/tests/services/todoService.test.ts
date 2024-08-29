import { TodoService } from '../../src/services/TodoService';
import { AppDataSource } from '../../src/data-source';
import { Todo, Board, TodoStatus } from '../../src/entities';
import { UserService } from '../../src/services/UserService';

jest.mock('../../src/data-source');
jest.mock('../../src/services/UserService');

describe('TodoService', () => {
  let todoService: TodoService;
  let mockTodoRepository: any;
  let mockBoardRepository: any;
  let mockUserService: any;

  beforeEach(() => {
    mockTodoRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockBoardRepository = {
      findOneBy: jest.fn(),
    };
    mockUserService = {
      findById: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Todo) return mockTodoRepository;
      if (entity === Board) return mockBoardRepository;
    });

    (UserService as jest.Mock).mockImplementation(() => mockUserService);

    todoService = new TodoService();
  });

  describe('findById', () => {
    it('should return the todo if found', async () => {
      const todoId = 'valid-todo-id';
      const mockTodo = { id: todoId, title: 'Test Todo' };
      mockTodoRepository.findOne.mockResolvedValue(mockTodo);

      const result = await todoService.findById(todoId);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoId },
        relations: ['board', 'createdBy'],
      });
      expect(result).toEqual(mockTodo);
    });

    it('should return null if todo is not found', async () => {
      const todoId = 'invalid-todo-id';
      mockTodoRepository.findOne.mockResolvedValue(null);

      const result = await todoService.findById(todoId);

      expect(result).toBeNull();
    });
  });

  describe('createTodo', () => {
    it('should create and save a todo if board and user exist', async () => {
      const todoName = 'New Todo';
      const userId = 'valid-user-id';
      const boardId = 'valid-board-id';
      const mockBoard = { id: boardId, name: 'Test Board' };
      const mockUser = { id: userId, username: 'test-user' };
      const mockTodo = { title: todoName, createdBy: mockUser, board: mockBoard };

      mockBoardRepository.findOneBy.mockResolvedValue(mockBoard);
      mockUserService.findById.mockResolvedValue(mockUser);
      mockTodoRepository.create.mockReturnValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue(mockTodo);

      const result = await todoService.createTodo(todoName, userId, boardId);

      expect(mockBoardRepository.findOneBy).toHaveBeenCalledWith({ id: boardId });
      expect(mockUserService.findById).toHaveBeenCalledWith(userId);
      expect(mockTodoRepository.create).toHaveBeenCalledWith({
        title: todoName,
        createdBy: mockUser,
        board: mockBoard,
      });
      expect(mockTodoRepository.save).toHaveBeenCalledWith(mockTodo);
      expect(result).toEqual(mockTodo);
    });

    it('should throw an error if the board is not found', async () => {
      const todoName = 'New Todo';
      const userId = 'valid-user-id';
      const boardId = 'invalid-board-id';

      mockBoardRepository.findOneBy.mockResolvedValue(null);

      await expect(todoService.createTodo(todoName, userId, boardId))
        .rejects
        .toThrow('Board not found');
    });

    it('should throw an error if the user is not found', async () => {
      const todoName = 'New Todo';
      const userId = 'invalid-user-id';
      const boardId = 'valid-board-id';
      const mockBoard = { id: boardId, name: 'Test Board' };

      mockBoardRepository.findOneBy.mockResolvedValue(mockBoard);
      mockUserService.findById.mockResolvedValue(null);

      await expect(todoService.createTodo(todoName, userId, boardId))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('updateTodoStatus', () => {
    it('should update the status of a todo if the transition is valid', async () => {
      const todoId = 'valid-todo-id';
      const newStatus = TodoStatus.ONGOING;
      const mockTodo = { id: todoId, status: TodoStatus.TODO };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue({
        ...mockTodo,
        status: newStatus,
        lastUpdated: new Date(),
      });

      const result = await todoService.updateTodoStatus(todoId, newStatus);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoId },
        relations: ['board', 'createdBy'],
      });
      expect(mockTodoRepository.save).toHaveBeenCalledWith({
        ...mockTodo,
        status: newStatus,
        lastUpdated: expect.any(Date),
      });
      expect(result.status).toBe(newStatus);
    });

    it('should throw an error if the todo is not found', async () => {
      const todoId = 'invalid-todo-id';
      const newStatus = TodoStatus.ONGOING;

      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(todoService.updateTodoStatus(todoId, newStatus))
        .rejects
        .toThrow('Todo not found');
    });

    it('should throw an error if the status transition is invalid', async () => {
      const todoId = 'valid-todo-id';
      const newStatus = TodoStatus.DONE;
      const mockTodo = { id: todoId, status: TodoStatus.TODO };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);

      await expect(todoService.updateTodoStatus(todoId, newStatus))
        .rejects
        .toThrow('Invalid status transition from TODO to DONE');
    });
  });
});