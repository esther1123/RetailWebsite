const withTM = require('next-transpile-modules')(['@awsui/components-react']);

module.exports = withTM({
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_REGION: 'us-west-2',
    NEXT_PUBLIC_APIG_ENDPOINT: 'https://1n01keixk0.execute-api.us-west-2.amazonaws.com',
    NEXT_PUBLIC_USER_POOL_ID: 'us-west-2_KFKmH618N',
    NEXT_PUBLIC_IDENTITY_POOL_ID: 'us-west-2:b88e0ba4-5f68-4504-a73d-6995961c66e3',
    NEXT_PUBLIC_USER_POOL_CLIENT_ID: '3ctle5b2fe187m3sr8ulng211b'
  }
});
