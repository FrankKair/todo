import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

export const Header: React.FC = () => {
  const { isLoggedIn, username, logout } = useAuth();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout();
      window.location.href = '/';
    }
  };

  const BoardsButton = () => (
    <div className="user-controls">
      <div className="username" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        {username}
      </div>
      <button>
        <a href="/boards">Boards</a>
      </button>
    </div>
  );

  const LoginButton = () => (
    <button>
      <a href="/login">Login</a>
    </button>
  );

  return (
    <header className="header">
      TODO BOARDS
      <nav>
        {isLoggedIn ? <BoardsButton /> : <LoginButton />}
      </nav>
    </header>
  );
};