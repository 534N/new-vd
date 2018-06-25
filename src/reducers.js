import { combineReducers } from 'redux';
import axios from 'axios';

const authReducer = (state={
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

const userReducer = (state={
  metaData: null,
}, action) => {
  switch (action.type) {
    case 'RECEIVE_USER_METADATA': {
      const { userMetadata } = action.payload;

      state = {
        ...state,
        metaData: userMetadata,
      };
      break;
    }
  }

  return state;
};

export default combineReducers({
  auth: authReducer,
  user: userReducer
});