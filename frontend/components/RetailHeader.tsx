import { Button, Header, SpaceBetween } from '@awsui/components-react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import Router from 'next/router';
import * as React from 'react';
import { useAppContext } from '../lib/contextLib';

const RetailHeader = () => {
  const { isAuthenticated, setIsAuthenticated } = useAppContext();

  const onClickLogout = async () => {
    await Auth.signOut();

    setIsAuthenticated(false);
    Router.push('/auth/sign-in');
  }

  return (
    <div className="retail-header-nav">
      <Header
        variant="h1"
        actions={
          isAuthenticated ?
            <Button onClick={onClickLogout} variant="link">Logout</Button> :
            <SpaceBetween direction="horizontal" size="xs">
              <Link href='/auth/sign-up'>Sign Up</Link>
              <Link href='/auth/sign-in'>Sign In</Link>
            </SpaceBetween>
        }
      >
        <strong>RETAIL STORE <span style={{ 'color': '#0070f3' }}>DEMO</span></strong>
      </Header>
    </div>
  );
}

export default RetailHeader;
