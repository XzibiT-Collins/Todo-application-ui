import { Amplify } from 'aws-amplify'

const awsconfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'eu-central-1',
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    authenticationFlowType: import.meta.env.VITE_AUTHENTICATION_FLOW_TYPE || 'ALLOW_USER_SRP_AUTH',
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: 'todoapi',
        endpoint: import.meta.env.VITE_API_BASE_URL,
        region: import.meta.env.VITE_AWS_REGION || 'eu-central-1'
      }
    ]
  }
};

try{
    Amplify.configure(awsconfig);
}catch(error){
    console.error("Error configuring Amplify:", error);
}

export default awsconfig;