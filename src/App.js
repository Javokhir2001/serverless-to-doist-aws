import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { awsConfig } from './aws-config';
import Auth from './Auth';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !accessToken) {
      // Exchange code for tokens
      const { userPoolWebClientId, redirectSignIn, cognitoDomain } = awsConfig;
      axios
        .post(
          `https://${cognitoDomain}/oauth2/token`,
          new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: userPoolWebClientId,
            code,
            redirect_uri: redirectSignIn,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((response) => {
          setAccessToken(response.data.access_token);
          window.history.replaceState({}, document.title, '/');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [accessToken]);

  const apiClient = axios.create({
    baseURL: awsConfig.apiInvokeUrl,
  });

  useEffect(() => {
    if (accessToken) {
      fetchTodos();
    }
  }, [accessToken]);

  const fetchTodos = async () => {
    try {
      const response = await apiClient.get('/todos', {
        headers: {
          Authorization: accessToken,
        },
      });
      setTodos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ... (rest of the code remains similar to previous App.js, handling addTodo, deleteTodo, toggleComplete)

  if (!accessToken) {
    return <Auth />;
  }

  // ... (rest of the component rendering code)
}

export default App;
