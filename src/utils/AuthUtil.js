export const isAuthenticated = auth => {
  return (
    isAuth0Authenticated(auth) &&
    hasMeaningfulAWSInfo(auth)
  )
}

const currentTime = () => +new Date();


// 
// JWT
// 
const isAuth0Authenticated = ({ auth0Authenticated, jwtTimeout }) => {
  return auth0Authenticated && jwtTimeout > currentTime();
}



// 
// AWS
// 
const hasMeaningfulAWSInfo = ({ aws }) => {
  return (
    !aws || 
    (aws && aws.expiration > currentTime())
  )
}



