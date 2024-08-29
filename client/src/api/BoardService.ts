import axios from 'axios';
import { Board } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export async function fetchBoardById(boardId: string): Promise<Board | null> {
  try {
    const response = await axios.get<Board | null>(`${BASE_URL}/boards/${boardId}`);
    return response.data || null;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed fetching board by id');
  }
}

export async function createBoard(boardName: string, ownerId: string): Promise<Board> {
  try {
    const response = await axios.post<Board>(`${BASE_URL}/boards`, {
      boardName,
      ownerId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to create board');
  }
}

export async function joinBoard(shareKey: string, userId: string): Promise<Board> {
  try {
    const response = await axios.post<Board>(`${BASE_URL}/boards/join`, {
      shareKey,
      userId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to join board');
  }
}