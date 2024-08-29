import React from 'react';
import { AppRouter } from './router';
import { AuthProvider } from './context';
import { Header } from './components';

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <Header />
        <AppRouter />
      </AuthProvider>
    </>
  );
};

export default App;