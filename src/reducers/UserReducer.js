import jwtDecode from 'jwt-decode'
import { allowRemotePlaybackFunc } from './utils/User'

const userReducer = (state = {
  metadata: null,
  billingURL: null,
  features: null,
  cameraGroups: [],
  user: null,
  permissions: null,
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
        const { user_metadata } = user;

        const permissions = {
          ...state.permissions,
          allowRemotePlayback: allowRemotePlaybackFunc(user_metadata)
        };
        
        state = {
          ...state,
          user,
          permissions,
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
          permissions: null,
        }

        break;
      }

    default:
      break;
  }

  return state;
};

export default userReducer;