import { Configuration, PublicClientApplication, LogLevel } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID || '';
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || '';
const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin;

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const initializeMsal = async (): Promise<void> => {
  await msalInstance.initialize();

  // Handle redirect response
  try {
    const response = await msalInstance.handleRedirectPromise();
    if (response) {
      // Validate tenant - only allow users from the configured tenant
      if (response.account?.tenantId !== tenantId) {
        console.error('Access denied: User is not from the authorized tenant');
        await msalInstance.logoutRedirect({
          postLogoutRedirectUri: redirectUri,
        });
        return;
      }
      msalInstance.setActiveAccount(response.account);
    }
  } catch (error) {
    console.error('Error handling redirect:', error);
  }

  // Set active account if available, but validate tenant
  const accounts = msalInstance.getAllAccounts();
  const validAccount = accounts.find(acc => acc.tenantId === tenantId);
  if (validAccount) {
    msalInstance.setActiveAccount(validAccount);
  } else if (accounts.length > 0) {
    // User has accounts but none from valid tenant - clear them
    msalInstance.setActiveAccount(null);
  }
};

export const isAuthConfigured = (): boolean => {
  return Boolean(clientId && tenantId);
};

export const getExpectedTenantId = (): string => {
  return tenantId;
};
