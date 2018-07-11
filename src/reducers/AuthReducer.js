import jwtDecode from 'jwt-decode';

const authReducer = (state = {
  auth0Authenticated: false,
  jwtTimeout: null,
  refreshToken: null,
  jwtToken: null,
  aws: null,
  s3: null,
  tenantId: null,
}, action) => {
  switch (action.type) {

    //
    // SHARED ACTIONS
    //
    case 'USER_LOG_IN':
      {
        const {
          refreshToken,
          idToken: jwtToken,
          expiresIn,
        } = action.payload;

        const jwtTimeout = +new Date() + expiresIn * 1000;
        const { tenantId } = jwtDecode(jwtToken);

        state = {
          ...state,
          refreshToken,
          jwtToken,
          jwtTimeout,
          auth0Authenticated: true,
          tenantId
        };
        break;
      }

    case 'REFRESH_INFO_FULFILLED':
      {
        const {
          data
        } = action.payload;

        const {
          aws: {
            expiration,
            ...restAWS
          }
        } = data.response;

        state = {
          ...state,
          aws: {
            expiration: +new Date(expiration),
            ...restAWS
          }
        }

        break;
      }

    case 'USER_LOG_OUT': {
      state = {
        ...state,
        auth0Authenticated: false,
        refreshToken: null,
        timeout: 0,
        jwtToken: null,
        aws: null,
        s3: null,
        tenantId: null,
      }

      break;
    }

    default:
      break;
  }

  return state;
};

export default authReducer;