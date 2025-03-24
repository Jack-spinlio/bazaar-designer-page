
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Check if Auth0 is properly configured
const isAuth0Configured = () => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  return !!domain && !!clientId && domain !== 'dev-example.us.auth0.com' && clientId !== 'dummyClientId';
};

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use Auth0 hook with error handling
  const auth0 = useAuth0();
  const {
    user,
    isAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    loginWithPopup,
    logout: auth0Logout,
    getAccessTokenSilently,
    error: auth0Error,
  } = auth0;

  // Combined loading state
  const isLoading = auth0IsLoading || !isInitialized;

  // Initialize the hook
  useEffect(() => {
    // Mark as initialized after a short delay to prevent UI flickering
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Log Auth0 errors
  useEffect(() => {
    if (auth0Error) {
      console.error('Auth0 error:', auth0Error);
      if (!isAuth0Configured()) {
        console.warn('Auth0 configuration issue detected. Check your environment variables.');
      } else {
        toast.error(`Authentication error: ${auth0Error.message}`);
      }
    }
  }, [auth0Error]);

  // Set the Supabase JWT when a user authenticates
  useEffect(() => {
    const setSupabaseSession = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
            },
          }).catch(err => {
            console.error('Failed to get Auth0 token:', err);
            return null;
          });
          
          if (token) {
            console.log('Auth0 token obtained successfully');
            
            // Use the token to set Supabase auth
            // This is just a placeholder - you'll need to implement your own JWT strategy
            console.log('Would set Supabase session with token');
            
            // When you have proper JWT implementation:
            // await supabase.auth.setSession({ access_token: token, refresh_token: '' });
          }
        } catch (error) {
          console.error('Error setting Supabase session:', error);
          toast.error('Failed to authenticate with database');
        }
      }
    };

    // Only attempt to set Supabase session if Auth0 is configured
    if (isAuth0Configured()) {
      setSupabaseSession();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const login = async () => {
    // If Auth0 is not configured, show a message and return a mock login
    if (!isAuth0Configured()) {
      console.warn('Auth0 is not configured. Skipping login.');
      toast.error('Authentication is not configured. Please contact the administrator.');
      return;
    }
    
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

  const logout = () => {
    console.log('Logging out user');
    if (isAuth0Configured()) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      // Mock logout for development when Auth0 is not configured
      console.log('Auth0 not configured, mocking logout');
      window.location.reload();
    }
  };

  // Provide a mock auth object if Auth0 is not configured
  if (!isAuth0Configured() && isInitialized) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login,
      logout,
    };
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
