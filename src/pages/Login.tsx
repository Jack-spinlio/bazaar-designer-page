
import React, { useEffect } from 'react';
import { useAuth } from '@/auth/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/marketplace';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bazaar</h1>
          <p className="text-gray-600">Sign in to access supplier features</p>
        </div>
        
        <div className="mt-8">
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-black/90"
            onClick={() => login()}
          >
            <LogIn className="h-5 w-5" />
            Sign in with Auth0
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
