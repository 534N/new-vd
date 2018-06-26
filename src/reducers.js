import { combineReducers } from 'redux';
import axios from 'axios';

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
  }

  return state;
};



export default combineReducers({
  auth: authReducer,
  user: userReducer,
  customer: customerReducer,
});