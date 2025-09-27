// src/config.js
export const awsConfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'eu-central-1',
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  }
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;