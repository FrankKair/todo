import { BoardService } from '../../src/services/BoardService';
import { AppDataSource } from '../../src/data-source';
import { Board, User } from '../../src/entities';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-key'),
}));

describe('BoardService', () => {
  let boardService: BoardService;

  const mockBoardRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(() => {
    // Mock repositories
    AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
      if (entity === Board) return mockBoardRepository;
      if (entity === User) return mockUserRepository;
    });

    boardService = new BoardService();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset all mocks after each test
  });

  describe('findById', () => {
    it('should return the board with todos and owner when found', async () => {
      const boardId = 'mock-board-id';
      const mockBoard = { id: boardId, name: 'Test Board', todos: [], owner: {} };

      mockBoardRepository.findOne.mockResolvedValue(mockBoard);

      const result = await boardService.findById(boardId);

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['todos', 'todos.createdBy', 'owner'],
      });
      expect(result).toEqual(mockBoard);
    });

    it('should return null if the board is not found', async () => {
      const boardId = 'non-existing-board-id';

      mockBoardRepository.findOne.mockResolvedValue(null);

      const result = await boardService.findById(boardId);

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['todos', 'todos.createdBy', 'owner'],
      });
      expect(result).toBeNull();
    });
  });

  describe('createBoard', () => {
    it('should create and return a new board with the owner', async () => {
      const ownerId = 'mock-owner-id';
      const mockOwner = { id: ownerId, username: 'mockOwner' };
      const mockBoard = { id: 'mock-board-id', name: 'Test Board', owner: mockOwner, users: [mockOwner] };

      mockUserRepository.findOneBy.mockResolvedValue(mockOwner);
      mockBoardRepository.create.mockReturnValue(mockBoard);
      mockBoardRepository.save.mockResolvedValue(mockBoard);

      const result = await boardService.createBoard('Test Board', ownerId);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: ownerId });
      expect(mockBoardRepository.create).toHaveBeenCalledWith({
        name: 'Test Board',
        owner: mockOwner,
        users: [mockOwner],
        shareKey: 'mock-uuid-key', // Mocked UUID
      });
      expect(mockBoardRepository.save).toHaveBeenCalledWith(mockBoard);
      expect(result).toEqual(mockBoard);
    });

    it('should throw an error if the owner is not found', async () => {
      const ownerId = 'non-existing-owner-id';

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(boardService.createBoard('Test Board', ownerId)).rejects.toThrow('Owner not found');
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: ownerId });
    });
  });

  describe('joinBoard', () => {
    it('should add a user to the board if share key and user are valid', async () => {
      const shareKey = 'valid-share-key';
      const userId = 'valid-user-id';
    
      const mockBoard = {
        id: 'board-id',
        name: 'Test Board',
        shareKey,
        users: [],
      };
    
      const mockUser = {
        id: userId,
        username: 'test-user',
        boards: [],
      };
    
      mockBoardRepository.findOne.mockResolvedValue(mockBoard);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockBoardRepository.save.mockResolvedValue(mockBoard);
    
      const result = await boardService.joinBoard(shareKey, userId);
    
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { shareKey },
        relations: ['users'],
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['boards'],
      });
    
      // Ensure user and board were updated
      expect(mockUser.boards).toEqual([mockBoard]); // Check if user's boards array contains the board
      expect(mockBoard.users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: mockUser.id, username: mockUser.username }),
        ])
      ); // Check if board's users array contains the user object
    
      // Check for circular reference removal
      expect(result.users).toEqual([{ ...mockUser, boards: [] }]);
    
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockBoardRepository.save).toHaveBeenCalledWith(mockBoard);
    });
    
    it('should throw an error if the board share key is invalid', async () => {
      const shareKey = 'invalid-share-key';
      mockBoardRepository.findOne.mockResolvedValue(null);

      await expect(boardService.joinBoard(shareKey, 'some-user-id')).rejects.toThrow('Invalid share key');
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { shareKey },
        relations: ['users'],
      });
    });

    it('should throw an error if the user is not found', async () => {
      const shareKey = 'valid-share-key';
      const mockBoard = { id: 'board-id', shareKey, users: [] };

      mockBoardRepository.findOne.mockResolvedValue(mockBoard);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(boardService.joinBoard(shareKey, 'non-existent-user-id')).rejects.toThrow('User not found');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-user-id' },
        relations: ['boards'],
      });
    });
  });
});