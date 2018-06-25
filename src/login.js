import React from 'react';
import {
  Redirect,
} from "react-router-dom";

import {
  auth0_clientID,
  auth0_domain
} from './settings';
import Auth0Lock from 'auth0-lock';
import store from './store';
import callhome from './api/Callhome';
import axios from 'axios';

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

// console.debug('Settings', Settings);
    this.lock = new Auth0Lock(
      auth0_clientID,
      auth0_domain,
      {
        allowSignUp: false,
        oidcConformant: false,
        container: 'login-page',
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

    const cb = (refreshToken, jwtToken) => {
      this.setState({ redirectToReferrer: true });

      if (refreshToken) {
        this.startRefreshTimer(0, { refreshToken, jwtToken });
      }
    };

    this.lock.on('authenticated', authResult => {
      if (authResult && authResult.refreshToken) {
        // AuthActions.loginViaRefresh(authResult.refreshToken, authResult.idToken, authResult.state);
        // this.login(authResult.refreshToken, authResult.idToken, authResult.state);

        console.debug('authResult >> ', authResult);
        const { idToken, refreshToken, expiresIn } = authResult;
        const { getUserMetadata } = callhome;
        // fakeAuth.authenticate(cb.bind(this, refreshToken, jwtToken));

        store.dispatch({type: 'USER_LOG_IN', payload: {refreshToken, idToken, expiresIn}})
        store.dispatch({type: 'USER_METADATA', payload: axios(getUserMetadata)})
      }
    });
  }

  componentDidMount() {
    this.lock.show();
  }

  componentWillUnmount() {
    debugger
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/home" } };
    const { redirectToReferrer } = this.state;

    console.debug('redirectToReferrer >>> ', redirectToReferrer)
    console.debug('from >>> ', from)
    return <div id='login-page'><Redirect to={ redirectToReferrer ? from : '/login' } /></div>;
  }



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
}

export default Login;