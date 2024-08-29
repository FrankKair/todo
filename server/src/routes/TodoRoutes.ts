import { Router } from 'express';
import { TodoService } from '../services';

export const router = Router();
const todoService = new TodoService();

// Get a specific todo by ID
router.get('/:id', async (req, res) => {
  try {
    const todo = await todoService.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new todo
router.post('/', async (req, res) => {
  try {
    const { todoName, userId, boardId } = req.body;
    const todo = await todoService.createTodo(todoName, userId, boardId);
    res.status(201).json(todo);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update the status of a todo
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTodo = await todoService.updateTodoStatus(req.params.id, status);
    res.status(200).json(updatedTodo);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});