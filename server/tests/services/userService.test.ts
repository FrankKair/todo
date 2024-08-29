import { UserService } from '../../src/services';
import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    await AppDataSource.initialize();
    userService = new UserService();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('createUser', () => {
    it('should hash password and create a new user', async () => {
      const userData = { username: 'john_doe', password: 'password123' };
      const hashedPassword = 'hashed_password';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const user = await userService.createUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(user.password).toBe(hashedPassword);
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate a user with correct credentials', async () => {
      const user = new User();
      user.username = 'john_doe';
      user.password = 'hashed_password';
      
      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const authenticatedUser = await userService.authenticateUser('john_doe', 'password123');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
      expect(authenticatedUser).toEqual(user);
    });

    it('should throw an error if the user is not found', async () => {
      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValue(null);

      await expect(userService.authenticateUser('invalid_user', 'password123')).rejects.toThrow('User not found');
    });

    it('should throw an error if the password is invalid', async () => {
      const user = new User();
      user.username = 'john_doe';
      user.password = 'hashed_password';

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.authenticateUser('john_doe', 'invalid_password')).rejects.toThrow('Invalid credentials');
    });
  });
});