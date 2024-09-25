import React from 'react';
import { awsConfig } from './aws-config';

export default function Auth() {
  const login = () => {
    const { cognitoDomain, userPoolWebClientId, redirectSignIn } = awsConfig;
    const loginUrl = `https://${cognitoDomain}/login?client_id=${userPoolWebClientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(redirectSignIn)}`;
    window.location.href = loginUrl;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>To-Do List</h1>
      <button onClick={login}>Sign In</button>
    </div>
  );
}
