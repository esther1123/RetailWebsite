import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import * as sst from '@serverless-stack/resources';

export default class MyStack extends sst.Stack {
  api;
  auth;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create a Cognito User Pool and Identity Pool
    this.auth = new sst.Auth(this, 'Auth', {
      cognito: {
        userPool: {
          // Users can login with their email and password
          signInAliases: { email: true }
        }
      }
    });

    // Create a HTTP API
    this.api = new sst.Api(this, 'Api', {
      routes: {
        'GET /recommendations': 'src/lambda.getRecommendationHandler',
        'GET /similar-items': 'src/lambda.getSimilarItemsHandler'
      }
    });

    this.api.attachPermissions([
      new PolicyStatement({
        actions: ['personalize:*'],
        effect: Effect.ALLOW,
        resources: ['arn:aws:personalize:us-west-2:180271428986:campaign/*']
      })
    ]);

    this.auth.attachPermissionsForAuthUsers([
      // Allow access to the API
      this.api
    ]);

    // Create a Next.js site
    const site = new sst.NextjsSite(this, 'Site', {
      path: 'frontend',
      environment: {
        NEXT_PUBLIC_REGION: scope.region,
        NEXT_PUBLIC_APIG_ENDPOINT: this.api.url,
        NEXT_PUBLIC_USER_POOL_ID: this.auth.cognitoUserPool?.userPoolId || 'us-west-2_KFKmH618N',
        NEXT_PUBLIC_IDENTITY_POOL_ID: this.auth.cognitoCfnIdentityPool.ref,
        NEXT_PUBLIC_USER_POOL_CLIENT_ID: this.auth.cognitoUserPoolClient?.userPoolClientId || '3ctle5b2fe187m3sr8ulng211b'
      }
    });

    // Show the endpoint in the output
    this.addOutputs({
      URL: site.url, // cloudfront url
      ApiEndpoint: this.api.url,
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool?.userPoolId || 'us-west-2_KFKmH618N',
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient?.userPoolClientId || '3ctle5b2fe187m3sr8ulng211b'
    });
  }
}
