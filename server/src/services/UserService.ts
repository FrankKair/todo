import bcrypt from 'bcrypt';
import { validate as isUuid } from 'uuid';
import { AppDataSource } from '../data-source';
import { User, Board } from '../entities';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private boardRepository = AppDataSource.getRepository(Board);

  async findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async createUser(userData: Partial<User>) {
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      boards: [],
    });
    return this.userRepository.save(user);
  }

  async authenticateUser(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async getUserBoards(userId: string): Promise<Board[]> {
    if (!isUuid(userId)) {
      throw new Error('Invalid UUID format');
    }
  
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    return this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.todos', 'todos')
      .leftJoinAndSelect('board.owner', 'owner')
      .leftJoin('board.users', 'users')
      .where('owner.id = :userId OR users.id = :userId', { userId })
      .getMany();
  }
}