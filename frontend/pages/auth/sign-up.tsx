import { Alert, Button, Container, Form, FormField, Grid, Header, Input, SpaceBetween } from '@awsui/components-react';
import { Auth } from 'aws-amplify';
import Router from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import { useAppContext } from '../../lib/contextLib';

const SignUp = () => {
  const { setIsAuthenticated } = useAppContext();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationCodeError, setConfirmationCodeError] = useState('');

  const [signupAlert, setSignupAlert] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState(null);

  const onSubmit = async () => {
    // Validate input
    email.length === 0 ? setEmailError('Email cannot be empty') : setEmailError('');
    password.length === 0 ? setPasswordError('Password cannot be empty') : setPasswordError('');
    password !== confirmPassword ? setConfirmPasswordError('Password doesn\'t match') : setConfirmPasswordError('');
    if (email.length === 0 || password.length === 0 || password !== confirmPassword) {
      console.log('validate input failed!');
      return;
    }

    try {
      setIsLoading(true);
      const newUser = await Auth.signUp({
        username: email,
        password: password
      });
      setNewUser(newUser);
      setSignupAlert('');
      console.log('Sign up successfully!', newUser);
    } catch (e) {
      console.error(e);
      setSignupAlert(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const signupForm = () => (
    <Grid gridDefinition={[{ colspan: 4, offset: 4 }, { offset: 4 }]}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => Router.push('/')}>Cancel</Button>
            <Button variant="primary" onClick={onSubmit} loading={isLoading}>Submit</Button>
          </SpaceBetween>
        }
        header={
          <Header
            variant="h1"
            description="Please sign up using email"
          >
            New User Sign Up
          </Header>
        }
      >
        <Container>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="Email" errorText={emailError}>
              <Input inputMode="email" value={email} onChange={({ detail }) => setEmail(detail.value)}/>
            </FormField>
            <FormField label="Password" errorText={passwordError}>
              <Input type="password" value={password} onChange={({ detail }) => setPassword(detail.value)}/>
            </FormField>
            <FormField label="Confirm Password" errorText={confirmPasswordError}>
              <Input type="password" value={confirmPassword} onChange={({ detail }) => setConfirmPassword(detail.value)}
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </Grid>
  );

  const onConfirmationClick = async () => {
    try {
      // Validate confirmation code
      if (confirmationCode === '') {
        setConfirmationCodeError('Confirmation code cannot be empty');
        return;
      } else {
        setConfirmationCodeError('');
      }

      setIsLoading(true);
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      console.log('Sign in successfully!');
      setSignupAlert('');
      setIsAuthenticated(true);
      await Router.push('/products/recommendation');
    } catch (e) {
      console.error(e);
      setSignupAlert(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const signupConfirmationForm = () => (
    <Grid gridDefinition={[{ colspan: 4, offset: 4 }]}>
      <Form actions={<Button variant="primary" onClick={onConfirmationClick} loading={isLoading}>Verify</Button>}>
        <FormField label="Confirmation Code" constraintText="Please check your email for confirmation code"
                   errorText={confirmationCodeError}>
          <Input value={confirmationCode} onChange={({ detail }) => setConfirmationCode(detail.value)}/>
        </FormField>
      </Form>
    </Grid>
  );

  return (
    <>
      {newUser === null ? signupForm() : signupConfirmationForm()}
      <Grid gridDefinition={[{ colspan: 4, offset: 4 }, { offset: 4 }]}>
        <Alert
          visible={signupAlert !== ''}
          type="error"
          header="Sign up failed"
        >
          {signupAlert}
        </Alert>
      </Grid>
    </>
  );
}

export default SignUp;
