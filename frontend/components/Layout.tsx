import { Box, Container, Grid, Header, SideNavigation } from '@awsui/components-react';
import { Auth } from 'aws-amplify';
import Router, { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { useAppContext } from '../lib/contextLib';
import { categories } from '../pages/products/categories/[category]';

const Layout = ({ children }) => {
  const { setIsAuthenticated } = useAppContext();
  const [activeHref, setActiveHref] = React.useState(useRouter().asPath);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      setIsAuthenticated(true);
    } catch (e) {
      console.warn('Not logged in, redirect to sign in page');
      setIsAuthenticated(false);
      await Router.push('/auth/sign-in');
    }
  }

  const categoryItems = categories.map(category => ({
    type: 'link',
    text: category,
    href: '/products/categories/' + category.toLowerCase()
  }));

  categoryItems.push({ type: 'divider' }, {
    type: 'link',
    text: 'Guess What You Like',
    href: '/products/recommendation'
  });

  return (
    <Box margin="xxl">
      <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
        <div>
          <Container
            header={
              <Header variant="h2">
                Categories
              </Header>
            }
          >
            <SideNavigation
              activeHref={activeHref}
              onFollow={e => {
                if (!e.detail.external) {
                  e.preventDefault();
                  setActiveHref(e.detail.href);
                  Router.push(e.detail.href);
                }
              }}
              items={categoryItems}
            />
          </Container>
        </div>
        <div style={{ marginLeft: "60px" }}>
          {children}
        </div>
      </Grid>
    </Box>
  );
};

export default Layout;