import jwtDecode from 'jwt-decode';

const authReducer = (state = {
  isAuthenticated: false,
  timeout: 0,
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
          expiresIn: timeout
        } = action.payload;

        const { tenantId } = jwtDecode(jwtToken);

        state = {
          ...state,
          refreshToken,
          jwtToken,
          timeout,
          isAuthenticated: true,
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
          aws
        } = data.response;

        state = {
          ...state,
          aws
        }

        break;
      }

    case 'USER_LOG_OUT': {
      state = {
        ...state,
        isAuthenticated: false,
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