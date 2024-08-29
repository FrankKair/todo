import { Router } from 'express';
import { BoardService } from '../services';

export const router = Router();
const boardService = new BoardService();

// Get a specific board by ID
router.get('/:id', async (req, res) => {
  try {
    const board = await boardService.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new board
router.post('/', async (req, res) => {
  try {
    const { boardName, ownerId } = req.body;
    const board = await boardService.createBoard(boardName, ownerId);
    res.status(201).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Join a board using a share key
router.post('/join', async (req, res) => {
  try {
    const { shareKey, userId } = req.body;
    const board = await boardService.joinBoard(shareKey, userId);
    res.status(200).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});