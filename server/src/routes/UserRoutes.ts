import { Router } from 'express';
import { UserService } from '../services';

export const router = Router();
const userService = new UserService();

router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.authenticateUser(username, password);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all boards for a user
router.get('/:id/boards', async (req, res) => {
  try {
    const boards = await userService.getUserBoards(req.params.id);
    res.status(200).json(boards);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});