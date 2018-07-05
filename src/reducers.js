import { combineReducers } from 'redux';

const authReducer = (state = {
  isAuthenticated: false,
  timeout: 0,
  refreshToken: null,
  jwtToken: null,
}, action) => {
  switch(action.type) {
    case 'USER_LOG_IN':
      const {
        refreshToken,
        idToken: jwtToken,
        expiresIn: timeout
      } = action.payload;

      state = {
        ...state,
        refreshToken,
        jwtToken,
        timeout,
        isAuthenticated: true
      };
      break;

    case 'USER_LOG_OUT': {
      state = {
        ...state,
        isAuthenticated: false,
        refreshToken: null,
        timeout: 0,
        jwtToken: null,
      }

      break;
    }

    default:
      break;
  }

  return state; 
};

const userReducer = (state = {
  metaData: null,
  billingURL: null,
}, action) => {
  switch (action.type) {
    case 'USER_METADATA_FULFILLED': {
      const { data } = action.payload;

      state = {
        ...state,
        metaData: data,
      };
      break;
    }

    case 'BILLING_INFO_FULFILLED': {
      const { data } = action.payload;

      state = {
        ...state,
        billingURL: data,
      };
      break;
    }

    default:
      break;
  }

  return state;
};

const customerReducer = (state = {
  customer: null,
}, action) => {
  switch (action.type) {
    case 'CUSTOMER_INFO_FULFILLED': {
      const { data } = action.payload;

      state = {
        ...state,
        customer: data,
      }
      break;
    }

    default:
      break;
  }

  return state;
};

const locationsReducer = (state = {
  locations: null,
  fetching: null,
  error: false,
}, action) => {
  switch (action.type) {
    case 'LOCATION_INFO_FULFILLED': {
      const {
        data
      } = action.payload;

      state = {
        ...state,
        locations: data,
        fetching: false,
      }
      break;
    }

    case 'LOCATION_INFO_PENDING': {
      state = {
        ...state,
        fetching: true,
      }
      break;
    }

    case 'LOCATION_INFO_REJECTED': {
      state = {
        ...state,
        error: true,
      }
      break;
    }

    default:
      break;
  }

  return state;
};

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  customer: customerReducer,
  locations: locationsReducer,
});