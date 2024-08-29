import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context';
import { TodoItem } from '../components';
import { fetchBoardById, createTodo, updateTodoStatus } from '../api';
import { Board, Todo, TodoStatus } from '../types';
import '../styles/BoardDetailPage.css';

export const BoardDetailPage: React.FC = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [board, setBoard] = useState<Board | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const board = await fetchBoardById(id!);
        console.log(board);
        setBoard(board);
      } catch (error) {
        console.error('Failed to load board', error);
      }
    };

    fetchBoard();
  }, [id]);

  const handleAddTodoClick = () => {
    setShowInput(!showInput);
  };

  const handleShareBoardKey = () => {
    if (board?.shareKey) {
      alert(`Here is your board key to share ${board.shareKey}`);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo) return;
    setLoading(true);

    try {
      const createdTodo = await createTodo(newTodo, userId, board!.id);

      setBoard((prevBoard) => {
        if (!prevBoard) return prevBoard;
        return {
          ...prevBoard,
          todos: [...(prevBoard.todos || []), createdTodo],
        };
      });

      setNewTodo('');
      setShowInput(false);
    } catch (error) {
      console.error('Failed to create todo', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodoStatus = async (todoId: string, newStatus: TodoStatus) => {
    try {
      const updatedTodo = await updateTodoStatus(todoId, newStatus);

      setBoard((prevBoard) => {
        if (!prevBoard) return prevBoard;
        const todos = prevBoard.todos || [];
        const updatedTodos = todos.map((todo) => {
          if (todo.id !== updatedTodo.id) return todo;
          return {
            ...todo,
            status: updatedTodo.status,
            lastUpdated: updatedTodo.lastUpdated
          };
        });

        return {
          ...prevBoard,
          todos: updatedTodos,
        };
      });
    } catch (error) {
      console.error('Failed to update TODO status', error);
    }
  };

  if (board === null) {
    return <p>Loading board...</p>;
  }

  const todosByStatus: Record<TodoStatus, Todo[]> = {
    TODO: board.todos?.filter((todo) => todo.status === 'TODO') || [],
    ONGOING: board.todos?.filter((todo) => todo.status === 'ONGOING') || [],
    DONE: board.todos?.filter((todo) => todo.status === 'DONE') || [],
  };

  const statusSections: Record<string, TodoStatus>[] = [
    { status: 'TODO', title: 'TODO' },
    { status: 'ONGOING', title: 'ONGOING' },
    { status: 'DONE', title: 'DONE' },
  ];

  return (
    <div className='container'>
      <h2>{board.name}</h2>

      <div className='button-container'>
        <button onClick={handleAddTodoClick}>Add new todo</button>
        <button onClick={handleShareBoardKey}>Share board key</button>
      </div>

      {showInput && (
        <form onSubmit={handleCreateTodo} className="todo-input-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new TODO name"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      <div className="board-columns">
        {statusSections.map(({ status, title }) => (
          <div key={status} className="column">
            <h3>{title}</h3>
            {todosByStatus[status].map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdateStatus={handleUpdateTodoStatus}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};