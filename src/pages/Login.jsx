import React from 'react';
import {
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Auth0Lock from 'auth0-lock';
import axios from 'axios';


import {
  auth0_clientID,
  auth0_domain
} from '../settings';
import { store } from '../store';
import callhome from '../api/Callhome';

import logo from '../svg/solink.svg';
import Flex from '../components/Flex';
import { isAuthenticated } from '../utils/AuthUtil'

import '../css/Login.css';

class Auth extends React.Component {
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
        container: 'lock-panel',
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
        const { getUserMetadata, getCustomer, getBillingURL, getLocations, refresh } = callhome;


        store.dispatch({ type: 'REFRESH_INFO', payload: axios(refresh(idToken, refreshToken)) })
        store.dispatch({ type: 'USER_LOG_IN', payload: { refreshToken, idToken, expiresIn } })
        store.dispatch({ type: 'CUSTOMER_INFO', payload: axios(getCustomer(idToken)) })
        store.dispatch({ type: 'BILLING_INFO', payload: axios(getBillingURL(idToken)) })
        store.dispatch({ type: 'LOCATION_INFO', payload: axios(getLocations(idToken)) })
        store.dispatch({ type: 'CHANGE_TIME', payload: { time: new Date() }})

      }
    });
  }

  componentDidMount() {
    this.lock.show();
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/app' } };
    const { auth } = this.props;

    return (
      <Flex justifyContent={`center`} alignItems={`center`} id='login-page'>
        <div id='lock-panel'>
          <Redirect to={isAuthenticated(auth) ? from : '/auth/login' } />
        </div>
      </Flex>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth
  };  
})(Auth);