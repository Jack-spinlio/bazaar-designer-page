
import React from 'react';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Auth0 configuration
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || 
                import.meta.env.VITE_AUTH0_FALLBACK_DOMAIN || 
                'dev-jxcml1qpmbgabh6v.us.auth0.com';
                
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'rTSJkyJmYL2VIARI3RaqLJruCquzfpXa';
  const redirectUri = window.location.origin;
  
  // For audience configuration
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || `https://${domain}/api/v2/`;

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || '/marketplace');
  };

  // Check if provider is configured
  const isConfigured = domain !== 'dev-example.us.auth0.com' && clientId !== 'dummyClientId';

  if (!isConfigured) {
    console.warn('Auth0 is not properly configured. Using dummy implementation.');
  }

  // Prevent Auth0 from attempting to initialize with invalid configuration
  if (!isConfigured) {
    return (
      <div className="auth-provider-fallback">
        {children}
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};
