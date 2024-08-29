import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { createBoard, joinBoard } from '../api';
import '../styles/CreateBoardPage.css';

interface BoardActionPageProps {
  readonly action: 'create' | 'join';
}

export const BoardActionPage: React.FC<BoardActionPageProps> = ({ action }) => {
  const [inputData, setInputData] = useState('');
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputData.trim() === '') {
      alert('Input cannot be empty');
      return
    }

    try {
      const board = action === 'create'
        ? await createBoard(inputData, userId)
        : await joinBoard(inputData, userId);
      navigate(`/boards/${board.id}`);
    } catch (error) {
      console.error(`Failed to ${action} board`, error);
    }
  };

  const getInputDetails = (action: 'create' | 'join') => {
    switch (action) {
      case 'create': return { placeholder: 'Board Name', name: 'boardName' };
      case 'join': return { placeholder: 'Board Key', name: 'boardKey' };
    }
  };

  const { placeholder, name } = getInputDetails(action);

  return (
    <div className="create-board-container">
      <h2>{action === 'create' ? 'Create New Board' : 'Join Board'}</h2>
      <form onSubmit={handleAction} className="create-board-form">
        <input
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder={placeholder}
          name={name}
        />
        <button type="submit">{action === 'create' ? 'Create' : 'Join'}</button>
      </form>
    </div>
  );
};