
import React from 'react';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  // Auth0 domain should typically end with auth0.com or your custom domain
  // If auth.bazaar.it is a custom domain, ensure it's properly configured in Auth0
  const domain = 'auth.bazaar.it'; 
  const clientId = 'yourAuth0ClientId'; // Replace with your actual Auth0 client ID
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || '/marketplace');
  };

  const onError = (error: Error) => {
    console.error('Auth0 error:', error);
    toast.error(`Authentication error: ${error.message}`);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
      onError={onError}
    >
      {children}
    </Auth0Provider>
  );
};
