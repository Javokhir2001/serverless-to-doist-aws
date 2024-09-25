export const awsConfig = {
    region: 'your-region', // e.g., 'us-east-1'
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-app-client-id',
    apiInvokeUrl: 'https://your-api-id.execute-api.your-region.amazonaws.com/prod',
    cognitoDomain: 'your-cognito-domain-prefix.auth.your-region.amazoncognito.com',
    redirectSignIn: 'http://localhost:3000/',
    redirectSignOut: 'http://localhost:3000/',
  };
  