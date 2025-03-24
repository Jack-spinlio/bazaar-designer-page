
import React from 'react';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const domain = 'auth.bazaar.it'; // Updated Auth0 domain
  const clientId = 'yourAuth0ClientId'; // Replace with your Auth0 client ID
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || '/marketplace');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
