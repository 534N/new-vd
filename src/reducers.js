import { combineReducers } from 'redux';

import AuthReducer from './reducers/AuthReducer';
import UserReducer from './reducers/UserReducer';
import CustomerReducer from './reducers/CustomerReducer';
import LocationsReducer from './reducers/LocationsReducer';
import DateTimeReducer from './reducers/DateTimeReducer';


const WindowReducer = (state = {
  width: null,
}, action) => {
  switch(action.type) {
    case 'WINDOW_SIZE': 
      {
        state = {
          ...state,
          width: action.payload
        }
        break
      }

    default: 
      break;
  }

  return state;
}

export default combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  customer: CustomerReducer,
  locations: LocationsReducer,
  time: DateTimeReducer,
  window: WindowReducer,
});