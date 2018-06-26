import React from 'react';
import {
  Route,
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';
import WithStore from './WithStore';

// const ProfilePage = () => 
//   <WithStore
//     selector={(state) => ({
//       name: state.user.name,
//       avatarUrl: avatarSelector(state),
//     })}
//   >
//     { (props, dispatch) => <UserProfile name={props.name} avatarUrl={props.avatarUrl} /> }
//   </WithStore>


const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <div>
            <Redirect
              to={{
                pathname: "/login",
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

