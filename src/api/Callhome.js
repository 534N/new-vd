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
  }
}
