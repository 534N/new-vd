import {
  callhome_url,
} from '../settings';

const getHeader = jwtToken => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwtToken}`
  };
}

export default {
  getUserMetadata(jwtToken) {
    return {
      method: 'GET',
      url: `${callhome_url}/api/users/metadata`,
      headers: getHeader(jwtToken)
    }
  },

  getCustomer(jwtToken) {
    return {
      method: 'GET',
      url: `${callhome_url}/api/locations/customer`,
      headers: getHeader(jwtToken)
    }
  },

  getBillingURL(jwtToken) {
    return {
      method: 'GET',
      url: `${callhome_url}/api/auth/billingUrl`,
      headers: getHeader(jwtToken)
    }
  },

  getLocations(jwtToken) {
    return {
      method: 'GET',
      url: `${callhome_url}/api/locations`,
      headers: getHeader(jwtToken)
    }
  },

  refresh(jwtToken, refreshToken) {
    return {
      method: 'POST',
      url: `${callhome_url}/api/auth/refresh`,
      data: {
        refreshToken: refreshToken,
        jwtToken: jwtToken,
        forceImpoersonate: false,
      }
    }
  },

  annotations(jwtToken, camId, data) {
    return {
      method: 'PATCH',
      url: `${callhome_url}/api/cameras/${camId}`,
      headers: getHeader(jwtToken),
      data,
    }
  }
}
