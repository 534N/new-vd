import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom";

import './index.css';
import Login from './login';

import registerServiceWorker from './registerServiceWorker';

const home = () => <div>Amazing home page</div>;
const events = () => <div>Events go here</div>;
const cameras = () => <div>Cameras go here</div>;
const NoMatch = () => <div>Nothing to see here</div>;

const AuthExample = () => (
  <Router>
    <Switch>
      <PrivateRoute exact path="/" component={home} />
      <PrivateRoute path="/home" component={home} />
      <PrivateRoute path='/home' component={home}/>
      <PrivateRoute path='/events' component={events}/>
      <PrivateRoute path='/cameras' component={cameras}/>
      <Route exact path='/login' component={Login} />
      <Route component={NoMatch}/>
    </Switch>
  </Router>
);

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
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

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

ReactDOM.render( <AuthExample /> , document.getElementById('root'));
registerServiceWorker();
