import axios from 'axios';
import { Todo, TodoStatus } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export async function fetchTodoById(todoId: string): Promise<Todo | null> {
  try {
    const response = await axios.get<Todo | null>(`${BASE_URL}/todos/${todoId}`);
    return response.data || null;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to fetch todo by id');
  }
}

export async function createTodo(todoName: string, userId: string, boardId: string): Promise<Todo> {
  try {
    const response = await axios.post<Todo>(`${BASE_URL}/todos`, {
      todoName,
      userId,
      boardId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to create todo');
  }
}

export async function updateTodoStatus(todoId: string, newStatus: TodoStatus): Promise<Todo>{
  try {
    const response = await axios.patch<Todo>(`${BASE_URL}/todos/${todoId}/status`, {
      status: newStatus,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to update status');
  }
}