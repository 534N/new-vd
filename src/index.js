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
import Home from './Home';
import Login from './Login';
import Nav from './Nav'
import Grid from './components/Grid';


const events = () => <div>Events go here</div>;
const cameras = () => <div>Cameras go here</div>;
const NoMatch = () => <div>Nothing to see here</div>;

const PrimaryLayout = ({ match }) => {
  return (
    <div className='primary-layout'>
      <Nav />
      <main>
        <Switch>
          <Route path={`${match.path}`} exact component={Home} />
          <Route path={`${match.path}/events`} component={events} />
          <Route path={`${match.path}/cameras`} component={cameras} />
          <Redirect to={`${match.url}`} />
        </Switch>
      </main>
    </div>
  )
}


const App = props => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Switch>
          <PrivateRoute exact path='/' component={PrimaryLayout} />
          <Route path='/auth' component={Login} />
          <Redirect to={Login}/>
        </Switch>
      </Router>
    </PersistGate>
  </Provider>
);

ReactDOM.render(
  <App />, document.getElementById('root')
);

registerServiceWorker();
