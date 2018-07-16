import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import 'typeface-roboto'

import {
  store,
  persistor
} from './store';

import './css/index.css';

import PrivateRoute from './PrivateRoute';

import PrimaryLayout from './layouts/PrimaryLayout.jsx';
import UnauthorizedLayout from './layouts/UnauthorizedLayout';

window.addEventListener("beforeunload", function( event ) {
  // make the close button ineffective
  event.preventDefault();

  
  store.dispatch({ type: 'WINDOW_CLOSE', payload: {}})
}, false);

const App = props => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
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
  </MuiPickersUtilsProvider>
);

export default App;
