import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  AuthPage,
  BoardActionPage,
  BoardDetailPage,
  HomePage
} from '../pages';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={AuthPage} />
        <Route path="/login" Component={AuthPage} />
        <Route path="/signup" element={<AuthPage isSignUp />} />
        <Route path="/boards" Component={HomePage} />
        <Route path="/boards/new" element={<BoardActionPage action='create' />} />
        <Route path="/boards/join" element={<BoardActionPage action='join' />} />
        <Route path="/boards/:id" Component={BoardDetailPage} />
      </Routes>
    </BrowserRouter>
  );
};