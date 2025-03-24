
import React from 'react';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Explicitly get environment variables with console logging
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const fallbackDomain = import.meta.env.VITE_AUTH0_FALLBACK_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  
  // Use the first available domain with a proper fallback
  const effectiveDomain = domain || fallbackDomain || 'dev-jxcml1qpmbgabh6v.us.auth0.com';
  const effectiveClientId = clientId || 'rTSJkyJmYL2VIARI3RaqLJruCquzfpXa';
  const effectiveAudience = audience || `https://${effectiveDomain}/api/v2/`;
  
  const redirectUri = window.location.origin;

  // Log configuration for debugging
  console.log('Auth0 configuration:', { 
    effectiveDomain, 
    effectiveClientId,
    effectiveAudience,
    redirectUri,
    envDomain: domain,
    envFallbackDomain: fallbackDomain,
    envClientId: clientId,
    envAudience: audience
  });

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || '/marketplace');
  };

  // Check if provider is configured with meaningful values
  const isConfigured = effectiveDomain !== 'dev-example.us.auth0.com' && 
                     effectiveClientId !== 'dummyClientId';

  if (!isConfigured) {
    console.warn('Auth0 is not properly configured. Using dummy implementation.');
    return (
      <div className="auth-provider-fallback">
        {children}
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={effectiveDomain}
      clientId={effectiveClientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: effectiveAudience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};
