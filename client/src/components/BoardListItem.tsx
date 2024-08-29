import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BoardListItem.css';

interface TodoBoardItemProps {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
}

export const BoardListItem: React.FC<TodoBoardItemProps> = ({ id, name, owner }) => {
  return (
    <div className="board-card">
      <h3 className="board-title">{name}</h3>
      <p className="board-owner">Owner: {owner}</p>
      <Link to={`/boards/${id}`} className="board-link">View Board</Link>
    </div>
  );
};