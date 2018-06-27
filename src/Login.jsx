import React from 'react';
import {
  Redirect,
} from "react-router-dom";
import { connect } from 'react-redux';

import {
  auth0_clientID,
  auth0_domain
} from './settings';
import Auth0Lock from 'auth0-lock';
import { store } from './store';
import callhome from './api/Callhome';
import axios from 'axios';
import logo from './svg/solink.svg';


import './Login.css';

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
      auth0_clientID,
      auth0_domain,
      {
        allowSignUp: false,
        oidcConformant: false,
        container: 'login-page',
        theme: {
          logo: logo,
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


    this.lock.on('authenticated', authResult => {
      if (authResult && authResult.refreshToken) {
        const { idToken, refreshToken, expiresIn } = authResult;
        const { getUserMetadata, getCustomer, getBillingURL } = callhome;

        store.dispatch({type: 'USER_LOG_IN', payload: {refreshToken, idToken, expiresIn}})
        store.dispatch({type: 'USER_METADATA', payload: axios(getUserMetadata(idToken))})
        store.dispatch({type: 'CUSTOMER_INFO', payload: axios(getCustomer(idToken))})
        store.dispatch({type: 'BILLING_INFO', payload: axios(getBillingURL(idToken))})
      }
    });
  }

  componentDidMount() {
    this.lock.show();
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/home" } };
    const { auth } = this.props;

    return (
      <div id='login-page'>
        <Redirect to={ auth.isAuthenticated ? from : '/login' } />
      </div>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth
  };  
})(Login);