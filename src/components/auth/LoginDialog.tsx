import React, { useState } from 'react';
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
import { LogIn } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { login, isLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
      // The dialog will be closed automatically after successful login
    } catch (error) {
      console.error('Login error in dialog:', error);
    } finally {
      setIsLoggingIn(false);
      // We don't close the dialog here, as we want to keep it open if there was an error
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
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-black/90"
            onClick={handleLogin}
            disabled={isLoggingIn || isLoading}
          >
            {isLoggingIn || isLoading ? (
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
            {isLoggingIn || isLoading ? 'Signing in...' : 'Sign in with Auth0'}
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
