import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { registerUser, loginUser } from '../api';
import '../styles/AuthPage.css';

interface AuthPageProps {
  readonly isSignUp?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ isSignUp = false }) => {
  const [username, setLoginUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setIsLoggedIn, setUsername, setUserId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/boards');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      alert('Both username & password are necessary');
      return
    }

    try {
      let user;
      if (isSignUp) {
        user = await registerUser(username, password);
      } else {
        user = await loginUser(username, password);
      }

      setIsLoggedIn(true);
      setUsername(user.username);
      setUserId(user.id);

      navigate('/boards');
    } catch (error) {
      alert(`${isSignUp ? 'Signup' : 'Login'} failed: ${error}`);
      console.error(`${isSignUp ? 'Signup' : 'Login'} failed`, error);
    }
  };

  const goToOtherPage = () => {
    navigate(isSignUp ? '/login' : '/signup');
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleLogin}>
        <h2>{isSignUp ? 'Create New User' : 'Login'}</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setLoginUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">{isSignUp ? 'Create Account' : 'Login'}</button>
      </form>
      <div className='auth-links'>
        <button onClick={goToOtherPage}>
          {isSignUp ? 'Already have an account? Login' : "Sign up"}
        </button>
      </div>
    </div>
  );
};