
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock user data for development when Auth0 is not configured
const MOCK_USER = {
  sub: 'mock-user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  picture: 'https://randomuser.me/api/portraits/lego/1.jpg',
};

// Check if Auth0 is properly configured with better detection
const isAuth0Configured = () => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const fallbackDomain = import.meta.env.VITE_AUTH0_FALLBACK_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  
  // Log the Auth0 configuration for debugging
  console.log('Auth0 configuration check:', { domain, fallbackDomain, clientId });
  
  return !!domain || !!fallbackDomain || (!!clientId && clientId !== 'dummyClientId');
};

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [mockIsAuthenticated, setMockIsAuthenticated] = useState(false);
  const [mockUser, setMockUser] = useState<typeof MOCK_USER | null>(null);
  
  // Use Auth0 hook with error handling
  const auth0 = useAuth0();
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    loginWithPopup,
    logout: auth0Logout,
    getAccessTokenSilently,
    error: auth0Error,
  } = auth0;

  // Load mock authentication state from localStorage on mount
  useEffect(() => {
    if (!isAuth0Configured()) {
      const savedAuth = localStorage.getItem('mockAuth');
      if (savedAuth) {
        try {
          const { isAuthenticated, user } = JSON.parse(savedAuth);
          setMockIsAuthenticated(isAuthenticated);
          setMockUser(user);
        } catch (e) {
          console.error('Error parsing saved mock auth', e);
        }
      }
    }
    
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

  // Set the Supabase JWT when a user authenticates with Auth0
  useEffect(() => {
    const setSupabaseSession = async () => {
      if (auth0IsAuthenticated && auth0User) {
        try {
          console.log('Attempting to get Auth0 token for Supabase session');
          
          // Get the configured domain with proper fallbacks
          const domain = import.meta.env.VITE_AUTH0_DOMAIN;
          const fallbackDomain = import.meta.env.VITE_AUTH0_FALLBACK_DOMAIN;
          const effectiveDomain = domain || fallbackDomain || 'dev-jxcml1qpmbgabh6v.us.auth0.com';
          
          // Use the configured audience or default to the domain
          const audience = import.meta.env.VITE_AUTH0_AUDIENCE || `https://${effectiveDomain}/api/v2/`;
          
          console.log('Getting token with audience:', audience);
          
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience,
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
  }, [auth0IsAuthenticated, auth0User, getAccessTokenSilently]);

  // Mock login function for development
  const mockLogin = () => {
    console.log('Using mock login');
    setMockIsAuthenticated(true);
    setMockUser(MOCK_USER);
    localStorage.setItem('mockAuth', JSON.stringify({ isAuthenticated: true, user: MOCK_USER }));
    toast.success('Successfully signed in as Demo User');
  };

  // Mock logout function for development
  const mockLogout = () => {
    console.log('Using mock logout');
    setMockIsAuthenticated(false);
    setMockUser(null);
    localStorage.removeItem('mockAuth');
    toast.info('Signed out');
  };

  const login = async () => {
    // If Auth0 is not configured, use mock login
    if (!isAuth0Configured()) {
      console.log('Auth0 is not configured. Using mock login.');
      mockLogin();
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
    console.log('Logout called');
    if (isAuth0Configured()) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      // Mock logout for development when Auth0 is not configured
      mockLogout();
    }
  };

  // Provide a mock auth object if Auth0 is not configured
  if (!isAuth0Configured() && isInitialized) {
    console.log('Using mock auth implementation');
    
    return {
      user: mockUser,
      isAuthenticated: mockIsAuthenticated,
      isLoading: false,
      login,
      logout,
    };
  }

  return {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading || !isInitialized,
    login,
    logout,
  };
};
