
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // This is now just a simple wrapper component
  // The actual auth logic has been moved to useAuth hook with demo mode only
  return (
    <div className="auth-provider">
      {children}
    </div>
  );
};
