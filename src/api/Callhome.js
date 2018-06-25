import {
  callhome_url,
} from '../settings';

export default {
  getUserMetadata(jwtToken) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    };

    return {
      method: 'GET',
      url: `${callhome_url}/api/users/metadata`,
      headers
    }
  }
}
