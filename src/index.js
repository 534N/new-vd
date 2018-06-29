import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  store,
  persistor
} from './store';

import './css/index.css';

import registerServiceWorker from './registerServiceWorker';
import PrivateRoute from './PrivateRoute';

import PrimaryLayout from './layouts/PrimaryLayout.jsx';
import UnauthorizedLayout from './layouts/UnauthorizedLayout';

const App = props => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Switch>
          <Route path='/auth' component={UnauthorizedLayout} />
          <PrivateRoute path='/app' component={PrimaryLayout} />
          <Redirect to='/auth'/>
        </Switch>
      </Router>
    </PersistGate>
  </Provider>
);

ReactDOM.render(
  <App />, document.getElementById('root')
);

registerServiceWorker();
