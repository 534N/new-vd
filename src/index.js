import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configPersist from './configureStore';
import { connect } from 'react-redux';

// import store from './store';

import './index.css';
import Login from './login';

import registerServiceWorker from './registerServiceWorker';
import PrivateRoute from './PrivateRoute';


const { store, persistor } = configPersist();


const home = () => <div>Amazing home page</div>;
const events = () => <div>Events go here</div>;
const cameras = () => <div>Cameras go here</div>;
const NoMatch = () => <div>Nothing to see here</div>;

const Counter = ({ auth }) => {
  return (
    <div>
      <pre>auth::: { auth }</pre>
    </div>
  );
};
const TestComp = connect(state => {
  return {
    auth: state.auth,
  };
})(Counter);

const AuthExample = () => (
  <div>
    <TestComp />
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
  </div>
);

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

ReactDOM.render(
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <AuthExample />
  </PersistGate>
</Provider>, document.getElementById('root'));
registerServiceWorker();
