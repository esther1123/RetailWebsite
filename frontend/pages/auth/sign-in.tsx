import { Alert, Button, Form, FormField, Grid, Input, SpaceBetween } from '@awsui/components-react';
import { Auth } from 'aws-amplify';
import Router from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../../lib/contextLib';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [alert, setAlert] = useState('');

  const { setIsAuthenticated } = useAppContext();

  const onSubmit = async () => {
    // Validate input
    email.length === 0 ? setEmailError('Email cannot be empty') : setEmailError('');
    password.length === 0 ? setPasswordError('Password cannot be empty') : setPasswordError('');
    if (email.length === 0 || password.length === 0) {
      console.log('validate input failed!');
      return;
    }

    try {
      await Auth.signIn({
        username: email,
        password: password
      });
      setAlert('');
      console.log('Login successfully!');
      setIsAuthenticated(true);
      await Router.push('/products/recommendation');
    } catch (e) {
      console.error(e);
      setAlert(e.message);
    }
  }

  const loginForm = () => (
    <Grid gridDefinition={[{ colspan: 2, offset: 5 }, { offset: 5 }]}>
      <Form actions={<Button variant="primary" onClick={onSubmit}>Login</Button>}>
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Email" errorText={emailError}>
            <Input inputMode="email" value={email} onChange={({ detail }) => setEmail(detail.value)}/>
          </FormField>
          <FormField label="Password" errorText={passwordError}>
            <Input type="password" value={password} onChange={({ detail }) => setPassword(detail.value)}/>
          </FormField>
        </SpaceBetween>
      </Form>
    </Grid>
  );

  return (
    <>
      {loginForm()}
      <Grid gridDefinition={[{ colspan: 2, offset: 5 }, { offset: 5 }]}>
        <Alert
          visible={alert !== ''}
          type="error"
          header="Sign up failed"
        >
          {alert}
        </Alert>
      </Grid>
    </>
  );
};

export default SignIn;
