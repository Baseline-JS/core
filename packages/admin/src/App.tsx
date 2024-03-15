import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { Authenticator } from '@aws-amplify/ui-react';
import { checkAdmin } from '@baseline/client-api/admin';
import { Route, Routes, useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './baseblocks/dashboard/pages/Dashboard';
import User from './baseblocks/user/pages/User';
import PageContent from './components/page-content/PageContent';
import Sidebar from './components/sidebar/Sidebar';
import Admins from './baseblocks/admin/pages/Admins';
import {
  createRequestHandler,
  getRequestHandler,
} from '@baseline/client-api/request-handler';
import { AxiosRequestConfig } from 'axios';

Amplify.configure({
  Auth: {
    Cognito: {
      signUpVerificationMethod: 'code',
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID || '',
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
      userPoolClientId:
        process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID || '',
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(undefined);
  const navigate = useNavigate();

  const handleAuth = async (): Promise<void> => {
    createRequestHandler(
      async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        const authSession = await fetchAuthSession();
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${authSession?.tokens?.idToken}`;
        return config;
      },
    );
    setIsAdmin(await checkAdmin(getRequestHandler()));
    setIsAuthenticated(true);
  };

  // Check on first load if user is still logged in
  useEffect(() => {
    void (async () => {
      try {
        const authSession = await fetchAuthSession();
        if (authSession?.tokens?.idToken) {
          await handleAuth();
        }
      } catch (error) {
        console.error(error);
      }
    })();

    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signedIn':
          void handleAuth();
          break;
        case 'signedOut':
          setIsAuthenticated(false);
          navigate('/');
          break;
        case 'signInWithRedirect_failure':
          break;
        case 'tokenRefresh':
          break;
        default:
          console.debug(`Unhandled event: ${data.payload.event}`);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      {isAuthenticated && isAdmin ? <Sidebar /> : <></>}
      <Authenticator>
        {() =>
          isAdmin ? (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admins" element={<Admins />} />
              <Route path="/settings" element={<User />} />
            </Routes>
          ) : (
            <PageContent>
              {isAdmin === undefined ? (
                <>{/** Waiting on API */}</>
              ) : (
                <>
                  <h1>Please contact your system administrator</h1>
                  <p>You do not have permission to view this content</p>
                  <button
                    onClick={() => {
                      void signOut();
                    }}
                  >
                    Sign out
                  </button>
                </>
              )}
            </PageContent>
          )
        }
      </Authenticator>
    </div>
  );
};

export default App;
