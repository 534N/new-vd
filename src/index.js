import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom";

import './index.css';
// import App from './App';
import Settings from './settings';
import Auth0Lock from 'auth0-lock';

import registerServiceWorker from './registerServiceWorker';

const App = () => (
  <Switch>
    <Route exact path='/' component={home}/>
    <Route path='/events' component={events}/>
    <Route path='/cameras' component={cameras}/>
    <Route component={NoMatch}/>
  </Switch>
);

const home = () => <div>Amazing home page</div>;
const events = () => <div>Events go here</div>;
const cameras = () => <div>Cameras go here</div>;
const NoMatch = () => <div>Nothing to see here</div>;

const AuthExample = () => (
  <Router>
    <Switch>
      <PrivateRoute path="/" component={App} />
      <Route exact path='/login' component={Login} />
    </Switch>
  </Router>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false
    };


    let sso = false;
    const search = window.location.search;
    if (/\?code=/.test(search)) {
      sso = true;
    }

    this.lock = new Auth0Lock(
      Settings.auth0_clientID,
      Settings.auth0_domain,
      {
        allowSignUp: false,
        oidcConformant: false,
        container: 'root',
        theme: {
          logo: 'https://solinkcloud.com/assets/d93cde7b506b1fe81bdfb93f38981dd5.png',
          primaryColor: '#0088cc'
        },
        auth: {
          redirect: false,
          responseType: 'token',
          params: {
            scope: 'openid app_metadata email user_metadata created_at roles tenantId userType eventTypes offline_access given_name family_name',
            device: 'VD Web'
          },
          sso: sso,
        }
      }
    );

    this.lock.on('authenticated', function(authResult) {
      if (authResult && authResult.refreshToken) {
        // AuthActions.loginViaRefresh(authResult.refreshToken, authResult.idToken, authResult.state);
        this.login(authResult.refreshToken, authResult.idToken, authResult.state);
      }
    });
  }

  

  componentDidMount() {
    this.lock.show();
  }

  login = (refreshToken, jwtToken, state, sso = false) => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });

      if (refreshToken) {
        this.startRefreshTimer(0, { refreshToken, jwtToken });
      }
    });
  };

  stopRefreshTimer = () => {
    if (this.refreshTimerId) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  };

  startRefreshTimer = (timeout, options, replace = false) => {
    if (replace) {
      this.stopRefreshTimer();
    }
    
    if (this.refreshTimerId) {
      this.refreshTimerId = setTimeout(() => {
        console.debug('time out... need to refresh now')
      }, timeout);
    }
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}


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

const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);

ReactDOM.render( <AuthExample /> , document.getElementById('root'));
registerServiceWorker();
