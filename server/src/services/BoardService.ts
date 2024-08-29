import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../data-source';
import { User, Board } from '../entities';

export class BoardService {
  private boardRepository = AppDataSource.getRepository(Board);
  private userRepository = AppDataSource.getRepository(User);

  async findById(id: string) {
    return this.boardRepository.findOne({
      where: { id },
      relations: ['todos', 'todos.createdBy', 'owner'],
    });
  }

  async createBoard(name: string, ownerId: string) {
    const owner = await this.userRepository.findOneBy({ id: ownerId });
    if (!owner) {
      throw new Error('Owner not found');
    }

    const board = this.boardRepository.create({
      name,
      owner,
      users: [owner],
      shareKey: uuidv4(), // Generate a unique share key
    });

    return this.boardRepository.save(board);
  }

  async joinBoard(shareKey: string, userId: string) {
    const board = await this.boardRepository.findOne({
      where: { shareKey },
      relations: ['users'],
    });
    if (!board) throw new Error('Invalid share key');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['boards'],
    });
    if (!user) throw new Error('User not found');

    if (!user.boards.some((b) => b.id === board.id)) {
      user.boards.push(board);
    }

    if (!board.users.some((u) => u.id === user.id)) {
      board.users.push(user);
    }

    await this.userRepository.save(user);
    await this.boardRepository.save(board);
    // Avoid circular references
    board.users = board.users.map((u) => ({ ...u, boards: []}));
    return board;
  }
}