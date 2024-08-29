import axios from 'axios';
import { User, Board } from '../types';

const BASE_URL = 'http://localhost:5000/api';

export async function registerUser(username: string, password: string): Promise<User> {
  try {
    const response = await axios.post<User>(`${BASE_URL}/users/register`, { username, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to register user');
  }
};

export async function loginUser(username: string, password: string): Promise<User> {
  try {
    const response = await axios.post<User>(`${BASE_URL}/users/login`, { username, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to login');
  }
};

export async function getUserById(id: string): Promise<User> {
  try {
    const response = await axios.get<User>(`${BASE_URL}/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to fetch user');
  }
};

export async function getUserBoards(userId: string): Promise<Board[]> {
  try {
    const response = await axios.get<Board[]>(`${BASE_URL}/users/${userId}/boards`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || 'Failed to fetch user boards');
  }
};