import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  store,
  persistor
} from './store';

import './index.css';

import registerServiceWorker from './registerServiceWorker';
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Login from './Login';


const events = () => <div>Events go here</div>;
const cameras = () => <div>Cameras go here</div>;
const NoMatch = () => <div>Nothing to see here</div>;

const AuthExample = () => (
  <Router>
    <Switch>
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute path="/home" component={Home} />
      <PrivateRoute path='/events' component={events}/>
      <PrivateRoute path='/cameras' component={cameras}/>
      <Route exact path='/login' component={Login} />
      <Route component={NoMatch}/>
    </Switch>
  </Router>
);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthExample />
    </PersistGate>
  </Provider>, document.getElementById('root')
);

registerServiceWorker();
