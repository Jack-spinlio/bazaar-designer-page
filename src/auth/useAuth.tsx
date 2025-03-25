
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Mock user data for demo mode
const MOCK_USER = {
  sub: 'mock-user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  picture: 'https://randomuser.me/api/portraits/lego/1.jpg',
};

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<typeof MOCK_USER | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load mock authentication state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('mockAuth');
    if (savedAuth) {
      try {
        const { isAuthenticated, user } = JSON.parse(savedAuth);
        setIsAuthenticated(isAuthenticated);
        setUser(user);
      } catch (e) {
        console.error('Error parsing saved mock auth', e);
      }
    }
    
    // Mark as initialized after a short delay to prevent UI flickering
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock login function for demo mode
  const login = async () => {
    console.log('Using demo login');
    setIsAuthenticated(true);
    setUser(MOCK_USER);
    localStorage.setItem('mockAuth', JSON.stringify({ isAuthenticated: true, user: MOCK_USER }));
    toast.success('Successfully signed in as Demo User');
  };

  // Mock logout function for demo mode
  const logout = () => {
    console.log('Using demo logout');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('mockAuth');
    toast.info('Signed out');
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    login,
    logout,
  };
};
