
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    loginWithPopup,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Set the Supabase JWT when a user authenticates
  useEffect(() => {
    const setSupabaseSession = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          // Use the token to set Supabase auth
          // This is just a placeholder - you'll need to implement your own JWT strategy
          console.log('Auth0 token obtained, would set Supabase session here');
          
          // When you have proper JWT implementation:
          // await supabase.auth.setSession({ access_token: token, refresh_token: '' });
        } catch (error) {
          console.error('Error setting Supabase session:', error);
        }
      }
    };

    setSupabaseSession();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const login = async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to redirect if popup is blocked
      await loginWithRedirect();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
  };
};
