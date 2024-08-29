import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  userId: string;
  loading: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setUsername: Dispatch<SetStateAction<string>>;
  setUserId: Dispatch<SetStateAction<string>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: '',
  userId: '',
  loading: true,
  setIsLoggedIn: () => { },
  setUsername: () => { },
  setUserId: () => { },
  logout: () => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUsername && storedUserId && storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserId(storedUserId);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    localStorage.setItem('userId', userId);
  }, [username, userId, isLoggedIn]);

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUsername('');
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userId, loading, setIsLoggedIn, setUsername, setUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
