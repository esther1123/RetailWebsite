const config = {
  //Backend config
  apiGateway: {
    REGION: process.env.NEXT_PUBLIC_REGION,
    // REGION: 'us-west-2',
    URL: process.env.NEXT_PUBLIC_APIG_ENDPOINT
    // URL: 'https://1n01keixk0.execute-api.us-west-2.amazonaws.com',
  },
  cognito: {
    USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
    // USER_POOL_ID: 'us-west-2_KFKmH618N',
    IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    // IDENTITY_POOL_ID: 'us-west-2:b88e0ba4-5f68-4504-a73d-6995961c66e3',
    USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
    // USER_POOL_CLIENT_ID: '3ctle5b2fe187m3sr8ulng211b'
  }
};

export default config;