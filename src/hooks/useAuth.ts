import { useState } from 'react';

interface User {
  id: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>({ id: 'user123', email: 'user@example.com' });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  const getAccessToken = async (): Promise<string> => {
    // This would normally fetch a token from your auth provider
    return 'mock-token-12345';
  };

  return {
    user,
    isAuthenticated,
    loading,
    getAccessToken
  };
}; 