import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Board } from '../types';
import { useAuth } from '../context/';
import { getUserBoards } from '../api';
import { BoardListItem } from '../components';
import '../styles/BoardListItem.css';

export const HomePage: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const { userId, loading } = useAuth();

  useEffect(() => {
    const fetchUserBoards = async () => {
      if (!loading && userId) {
        try {
          const boards = await getUserBoards(userId);
          setBoards(boards);
        } catch (error) {
          console.error('Failed to fetch boards', error);
          setBoards([]);
        }
      }
    };

    fetchUserBoards();
  }, [loading, userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="button-container">
        <Link to="/boards/new">
          <button>Create New Board</button>
        </Link>
        <Link to="/boards/join">
          <button>Join a Board</button>
        </Link>
      </div>

      <div className="boards-list">
        {boards.map((board) => (
          <BoardListItem
            key={board.id}
            id={board.id}
            name={board.name}
            owner={board.owner.username}
          />
        ))}
      </div>
    </div>
  );
};