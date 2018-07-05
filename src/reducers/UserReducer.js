import jwtDecode from 'jwt-decode';

const userReducer = (state = {
  metadata: null,
  billingURL: null,
  features: null,
  cameraGroups: [],
  user: null,
}, action) => {
  switch (action.type) {
    case 'BILLING_INFO_FULFILLED':
      {
        const {
          data
        } = action.payload;

        state = {
          ...state,
          billingURL: data,
        };
        break;
      }

    //
    // SHARED ACTIONS
    // 
    case 'USER_LOG_IN':
      {
        const {
          idToken: jwtToken,
        } = action.payload;

        const user = jwtDecode(jwtToken);

        state = {
          ...state,
          user
        };
        break;
      }

    case 'REFRESH_INFO_FULFILLED':
      {
        const {
          data
        } = action.payload;

        const {
          user
        } = data.response;

        state = {
          ...state,
          ...user,
        }

        break;
      }

    case 'USER_LOG_OUT':
      {
        state = {
          ...state,
          user: null,
          metadata: null,
          billingURL: null,
          features: null,
          cameraGroups: [],
        }

        break;
      }

    default:
      break;
  }

  return state;
};

export default userReducer;