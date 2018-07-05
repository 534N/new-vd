import { combineReducers } from 'redux';

import AuthReducer from './reducers/AuthReducer';
import UserReducer from './reducers/UserReducer';
import CustomerReducer from './reducers/CustomerReducer';
import LocationsReducer from './reducers/LocationsReducer';




export default combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  customer: CustomerReducer,
  locations: LocationsReducer,
});