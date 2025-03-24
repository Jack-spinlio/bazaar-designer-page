
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoginDialog } from '@/components/auth/LoginDialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showLoginDialog, setShowLoginDialog] = useState(!isAuthenticated && !isLoading);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">You need to sign in to access this page.</p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowLoginDialog(true)}
          >
            Sign In
          </button>
        </div>
      </>
    );
  }

  return <>{children}</>;
};
