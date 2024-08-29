import React from 'react';
import { Todo, TodoStatus } from '../types';
import '../styles/TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  readonly onUpdateStatus: (todoId: string, newStatus: TodoStatus) => void;
}

const formatedDate = (d: string) =>
  new Date(d).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdateStatus }) => {
  const { id, title, status, lastUpdated, createdBy } = todo;

  const statusOptions: Record<TodoStatus, TodoStatus[]> = {
    ['TODO']: ['ONGOING'],
    ['ONGOING']: ['TODO', 'DONE'],
    ['DONE']: ['ONGOING'],
  };

  const handleStateChange = (newStatus: TodoStatus) => {
    onUpdateStatus(id, newStatus);
  };

  return (
    <div className="todo-item">
      <div>
        <div className="todo-content">
          <h4>{title}</h4>
        </div>
        <p>
          Created by: {createdBy.username}
        </p>
        <p>
          Last updated: {formatedDate(lastUpdated)}
        </p>
        <div className="button-group">
          {statusOptions[status].map((nextStatus) => (
            <button key={nextStatus} onClick={() => handleStateChange(nextStatus)}>
              {nextStatus}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};