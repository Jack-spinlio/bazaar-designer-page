
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/auth/useAuth';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check if any Auth0 environment variables are configured
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const fallbackDomain = import.meta.env.VITE_AUTH0_FALLBACK_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  
  const isAuth0Configured = !!domain || !!fallbackDomain || 
                          (!!clientId && clientId !== 'dummyClientId');

  console.log('Auth0 configuration status:', { 
    isConfigured: isAuth0Configured,
    domain,
    fallbackDomain,
    clientId
  });

  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
    }
  }, [isAuthenticated, onOpenChange, open]);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error('Login error in dialog:', error);
      setLoginError(error instanceof Error ? error.message : 'Failed to sign in. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign in to Bazaar</DialogTitle>
          <DialogDescription>
            Sign in to access supplier features and save your designs
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {!isAuth0Configured && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Using demo mode</p>
                <p className="text-sm">Auth0 is not configured. You'll be logged in with a demo account.</p>
              </div>
            </div>
          )}
          
          {loginError && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Authentication error</p>
                <p className="text-sm">{loginError}</p>
              </div>
            </div>
          )}
          
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-black/90"
            onClick={handleLogin}
            disabled={isLoggingIn || isLoading}
          >
            {isLoggingIn || isLoading ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
            ) : isAuth0Configured ? (
              <LogIn className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
            {isLoggingIn || isLoading ? 'Signing in...' : isAuth0Configured ? 'Sign in with Auth0' : 'Sign in with Demo Account'}
          </Button>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">
            Don't have an account? You'll be able to create one during sign in.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
