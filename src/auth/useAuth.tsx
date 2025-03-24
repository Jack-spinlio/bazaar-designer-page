
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    loginWithPopup,
    logout,
    getAccessTokenSilently,
    error: auth0Error,
  } = useAuth0();

  // Log Auth0 errors
  useEffect(() => {
    if (auth0Error) {
      console.error('Auth0 error:', auth0Error);
      toast.error(`Authentication error: ${auth0Error.message}`);
    }
  }, [auth0Error]);

  // Set the Supabase JWT when a user authenticates
  useEffect(() => {
    const setSupabaseSession = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          console.log('Auth0 token obtained successfully');
          
          // Use the token to set Supabase auth
          // This is just a placeholder - you'll need to implement your own JWT strategy
          console.log('Would set Supabase session with token');
          
          // When you have proper JWT implementation:
          // await supabase.auth.setSession({ access_token: token, refresh_token: '' });
        } catch (error) {
          console.error('Error setting Supabase session:', error);
          toast.error('Failed to authenticate with database');
        }
      }
    };

    setSupabaseSession();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const login = async () => {
    try {
      console.log('Attempting login with popup');
      await loginWithPopup();
    } catch (error) {
      console.error('Login popup error:', error);
      toast.error('Login popup failed. Trying redirect method.');
      
      // Fallback to redirect if popup is blocked
      try {
        await loginWithRedirect();
      } catch (redirectError) {
        console.error('Login redirect error:', redirectError);
        toast.error('Authentication failed. Please try again later.');
      }
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: () => {
      console.log('Logging out user');
      logout({ logoutParams: { returnTo: window.location.origin } });
    },
  };
};
