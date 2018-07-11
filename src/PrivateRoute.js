import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { isAuthenticated } from './utils/AuthUtil'

const PrivateRoute = ({ component: Component, auth, ...rest }) => {

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated(auth) ? (
          <Component {...props} />
        ) : (
          <div>
            <Redirect
              to={{
                pathname: '/auth/login',
                state: { from: props.location }
              }} />
          </div>
        )
      }
    />
  )
};

export default connect(store => {
  return {
    auth: store.auth
  };
})(PrivateRoute);

