import '@awsui/global-styles/index.css';
import { Amplify } from 'aws-amplify';
import React, { useState } from 'react';
import RetailHeader from '../components/RetailHeader';
import config from '../config';
import { AppContext } from '../lib/contextLib';
import '../styles/globals.css';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.USER_POOL_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: 'RetailWebApp',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

function MyApp({Component, pageProps}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AppContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
      <RetailHeader/>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
